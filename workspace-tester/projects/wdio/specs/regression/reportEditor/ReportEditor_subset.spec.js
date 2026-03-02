import * as reportConstants from '../../../constants/report.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';

describe('Report Editor Subset in Workstation', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        reportTOC,
        reportFilterPanel,
        reportPageBy,
        reportEditorPanel,
        reportDerivedMetricEditor,
    } = browsers.pageObj1;

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

    it('[TC85100_1] Report editor subset TC85100 Case 1 Simple_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.Simple_SR.id,
            projectId: reportConstants.Simple_SR.project.id,
        });

        await reportDatasetPanel.openObjectContextMenu('Category');

        await since('Join Type menu item should not exist')
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Join Type').isExisting())
            .toBe(false);

        await since('Rename menu item should not exist')
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Rename').isExisting())
            .toBe(false);

        await since('Remove menu item should not exist')
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Remove').isExisting())
            .toBe(false);

        await reportToolbar.dismissContextMenu();
    });

    it('[TC85100_2] Report editor subset TC85100 Case 2 IC_SR2 in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_SR2.id,
            projectId: reportConstants.IC_SR2.project.id,
        });
        await reportToolbar.switchToDesignMode();

        // And the grid cell at "2", "0" has text "Manager LastName Starts with A"
        await since(
            'The grid cell at "2", "0" should have text "Manager LastName Starts with A", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Manager LastName Starts with A');

        // And the grid cell at "4", "2" has text "Gale"
        await since('The grid cell at "4", "2" should have text "Gale", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('Gale');

        // And the grid cell at "6", "4" has text "$52,628.48"
        await since('The grid cell at "6", "4" should have text "$52,628.48", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(6, 4))
            .toBe('$52,628.48');

        // And the grid cell at "8", "0" has text "Average"
        await since('The grid cell at "8", "0" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 0))
            .toBe('Average');

        // // And I scroll ag-grid "Visualization 1" 250 pixels to the "right"
        // await reportGridView.scrollGridHorizontally('Visualization 1', 250);

        // // And the grid cell at "7", "10" has text "$1,118,367.78"
        // await since('The grid cell at "7", "10" should have text "$1,118,367.78", instead we have #{actual}')
        //     .expect(await reportGridView.getGridCellTextByPos(7, 10))
        //     .toBe('$1,118,367.78');
    });

    it('[TC85100_3] Report editor subset TC85100 Case 3 IC_CFCL_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_CFCL_SR.id,
            projectId: reportConstants.IC_CFCL_SR.project.id,
        });
        await reportTOC.switchToFilterPanel();
        // // Then there should be no report filter at non-aggregation level from Filter panel in Report Editor
        // await since('There should be no report filter at non-aggregation level from Filter panel in Report Editor')
        //     .expect(await reportFilterPanel.getEmptyFilter('filter'))
        //     .toBe(false);

        // // Then there should be no report filter at aggregation level from Filter panel in Report Editor
        // await since('There should be no report filter at aggregation level from Filter panel in Report Editor')
        //     .expect(await reportFilterPanel.getEmptyFilter('limit'))
        //     .toBe(false);
        await takeScreenshotByElement(reportFilterPanel.filterPanelContainer, 'TC85100_3', 'Filter Panel');

        // When I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // And the grid cell at "1", "0" has text "2015"
        await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2015');

        // And the grid cell at "2", "1" has text "$292,408"
        await since('The grid cell at "2", "1" should have text "$292,408", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$292,408');
    });

    it('[TC85100_4] Report editor subset TC85100 Case 4 IC_FFSQL_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_FFSQL_SR.id,
            projectId: reportConstants.IC_FFSQL_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Metrics" should be "Profit_Emp_FFSQL"
        await since(
            'The current selection for page by selector "Metrics" should be "Profit_Emp_FFSQL", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Profit_Emp_FFSQL');

        // And the grid cell at "0", "0" has text "Region_FFSQL"
        await since('The grid cell at "0", "0" should have text "Region_FFSQL", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Region_FFSQL');

        // And the grid cell at "0", "1" has text "Profit_Emp_FFSQL"
        await since('The grid cell at "0", "1" should have text "Profit_Emp_FFSQL", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Profit_Emp_FFSQL');

        // And the grid cell at "1", "0" has text "Northeast"
        await since('The grid cell at "1", "0" should have text "Northeast", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Northeast');

        // And the grid cell at "1", "1" has text "31,761,742"
        await since('The grid cell at "1", "1" should have text "31,761,742", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('31,761,742');
    });

    it('[TC85100_5] Report editor subset TC85100 Case 5 IC_Hierarchy_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_Hierarchy_SR.id,
            projectId: reportConstants.IC_Hierarchy_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // And the grid cell at "0", "1" has text "Subcategory"
        await since('The grid cell at "0", "1" should have text "Subcategory", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Subcategory');

        // And the grid cell at "8", "3" has text "$18,947"
        await since('The grid cell at "8", "3" should have text "$18,947", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$18,947');
    });

    it('[TC85100_6] Report editor subset TC85100 Case 6 IC_MDX_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_MDX_SR.id,
            projectId: reportConstants.IC_MDX_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Account Number" should be "1170"
        await since(
            'The current selection for page by selector "Account Number" should be "1170", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Account Number'))
            .toBe('1170');

        // And the grid cell at "1", "0" has text "Amount"
        await since('The grid cell at "1", "0" should have text "Amount", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Amount');

        // And the grid cell at "1", "1" has text "Deferred Taxes"
        await since('The grid cell at "1", "1" should have text "Deferred Taxes", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Deferred Taxes');

        // And the grid cell at "1", "2" has text "Assets"
        await since('The grid cell at "1", "2" should have text "Assets", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Assets');

        // And the grid cell at "1", "3" has text "505,424"
        await since('The grid cell at "1", "3" should have text "505,424", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('505,424');
    });

    it('[TC85100_7] Report editor subset TC85100 Case 7 IC_QB_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_QB_SR.id,
            projectId: reportConstants.IC_QB_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Cust2" should be "1"
        await since('The current selection for page by selector "Cust2" should be 1, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Cust2'))
            .toBe('1');

        // And the grid cell at "1", "0" has text "Call2"
        await since('The grid cell at "1", "0" should have text Call2, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Call2');

        // And the grid cell at "1", "1" has text "8"
        await since('The grid cell at "1", "1" should have text 8, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('8');

        // And the grid at "1", "2" has text "18"
        await since('The grid at "1", "2" should have text 18, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('18');

        // And the grid cell at "1", "3" has text "8"
        await since('The grid cell at "1", "3" should have text 8, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('8');

        // And the grid at "1", "3" has text "18"
        await since('The grid at "1", "4" should have text 18, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('18');

        // And the grid cell at "2", "1" has text "69,516"
        await since('The grid cell at "2", "1" should have text 69,516, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('69,516');

        // And the grid at "2", "1" has text "5,525"
        await since('The grid at "2", "1" should have text 5,525, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('5,525');

        // And the grid cell at "2", "3" has text "80,351"
        await since('The grid cell at "2", "3" should have text "80,351", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('80,351');

        // And the grid at "2", "3" has text "6,407"
        await since('The grid at "2", "3" should have text "6,407", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('6,407');
    });

    it('[TC85100_8] Report editor subset TC85100 Case 9 IM_Airline_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IM_Airline_SR.id,
            projectId: reportConstants.IM_Airline_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();

        // Then The current selection for page by selector "Metrics" should be "Avg Delay (min)"
        await since(
            'The current selection for page by selector "Metrics" should be Avg Delay (min), instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Avg Delay (min)');

        // And the grid cell at "1", "0" has text "BWI"
        await since('The grid cell at "1", "0" should have text "BWI", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('BWI');

        // And the grid cell at "1", "1" has text "AirTran Airways Corporation"
        await since(
            'The grid cell at "1", "1" should have text "AirTran Airways Corporation", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('AirTran Airways Corporation');

        // And the grid cell at "1", "2" has text "37,769.13"
        await since('The grid cell at "1", "2" should have text "37,769.13", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('37,769.13');

        // And the grid cell at "1", "3" has text "35,850.13"
        await since('The grid cell at "1", "3" should have text "35,850.13", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('35,850.13');

        // And the grid cell at "1", "4" has text "3,622.03"
        await since('The grid cell at "1", "4" should have text "3,622.03", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('3,622.03');
    });
    it('[TC85100_9] Report editor subset TC85100 Case 10 IM_Mapped_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IM_Mapped_SR.id,
            projectId: reportConstants.IM_Mapped_SR.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Country" should be "1"
        await since('The current selection for page by selector "Country" should be 1, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Country'))
            .toBe('1');

        // Then The current selection for page by selector "Region" should be "Central"
        await since('The current selection for page by selector "Region" should be Central, instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Central');

        // Then The current selection for page by selector "Manager" should be "Barbara:Aoter"
        await since(
            'The current selection for page by selector "Manager" should be Barbara:Aoter, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Barbara:Aoter');

        // And the grid cell at "0", "1" has text "De Le Torre"
        await since('The grid cell at "0", "1" should have text De Le Torre, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('De Le Torre');

        // And the grid cell at "0", "2" has text "Kieferson"
        await since('The grid cell at "0", "2" should have text Kieferson, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Kieferson');

        // And the grid cell at "0", "3" has text "Sonder"
        await since('The grid cell at "0", "3" should have text Sonder, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Sonder');

        // And the grid cell at "1", "1" has text "Sandra"
        await since('The grid cell at "1", "1" should have text Sandra, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Sandra');

        // And the grid cell at "1", "2" has text "Jack"
        await since('The grid cell at "1", "2" should have text Jack, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Jack');

        // And the grid cell at "1", "3" has text "Melanie"
        await since('The grid cell at "1", "3" should have text "Melanie", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('Melanie');

        // And the grid cell at "2", "0" has text "Tot Cost"
        await since('The grid cell at "2", "0" should have text "Tot Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Tot Cost');

        // And the grid cell at "2", "1" has text "514795.2711"
        await since('The grid cell at "2", "1" should have text "514795.2711", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('514795.2711');

        // And the grid cell at "2", "2" has text "497463.0872"
        await since('The grid cell at "2", "2" should have text "497463.0872", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('497463.0872');

        // And the grid cell at "2", "3" has text "251183.2263"
        await since('The grid cell at "2", "3" should have text "251183.2263", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('251183.2263');

        // And the grid cell at "3", "0" has text "Tot Dollar Sales"
        await since('The grid cell at "3", "0" should have text "Tot Dollar Sales", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 0))
            .toBe('Tot Dollar Sales');

        // And the grid cell at "3", "1" has text "607895.4"
        await since('The grid cell at "3", "1" should have text "607895.4", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('607895.4');

        // And the grid cell at "3", "2" has text "584933"
        await since('The grid cell at "3", "2" should have text "584933", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 2))
            .toBe('584933');

        // And the grid cell at "3", "3" has text "295107.8"
        await since('The grid cell at "3", "3" should have text "295107.8", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('295107.8');
    });
    // it('[TC85100_10] Report editor subset TC85100 Case 11 Simple_SR_PromptElement in workstation', async () => {
    //     await libraryPage.editReportByUrl({
    //         dossierId: reportConstants.Simple_SR_PromptElement.id,
    //         projectId: reportConstants.Simple_SR_PromptElement.project.id,
    //     });
    //     await reportToolbar.switchToDesignMode();
    //     // When I double click available object "Category" in "Qualify on the attribute 'Category'." section with index "1." in prompt editor in Report Editor
    //     await reportPromptEditor.chooseItemInAvailableCart('1', "Qualify on the attribute 'Category'.", 'Category');

    //     // And I click expression value label for the object "Category" with order "1" in the expression editor in "Qualify on the attribute 'Category'." section with index "1." in prompt editor in Report Editor
    //     await reportPromptEditor.clickValueLabel('1', "Qualify on the attribute 'Category'.", '1', 'Category');

    //     // And I input value "4" for the expression in prompt editor in Report Editor
    //     await reportPromptEditor.enterExprValue('4');

    //     // And I click "OK" button from the pop up window in prompt editor in Report Editor
    //     await reportPromptEditor.clickPopupCellBtn('OK');

    //     // And I click Apply button in Report Prompt Editor
    //     await reportPromptEditor.clickApplyButtonInReportPromptEditor();

    //     // And the grid cell at "0", "0" has text "Category"
    //     await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Category');

    //     // And the grid cell at "0", "1" has text "Cost"
    //     await since('The grid cell at "0", "1" should have text "Cost", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Cost');

    //     // And the grid cell at "1", "0" has text "Music"
    //     await since('The grid cell at "1", "0" should have text "Music", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('Music');

    //     // And the grid cell at "1", "1" has text "$2,800,929"
    //     await since('The grid cell at "1", "1" should have text "$2,800,929", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('$2,800,929');
    // });

    // it('[TC85100_11] Report editor subset TC85100 Case 6, DE242940 remove only for derived metrics', async () => {
    //     await libraryPage.editReportByUrl({
    //         dossierId: reportConstants.Simple_SR.id,
    //         projectId: reportConstants.Simple_SR.project.id,
    //     });

    //     // When I switch to design mode in Report Editor
    //     await reportToolbar.switchToDesignMode();

    //     // And the grid cell at "0", "0" has text "Year"
    //     await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //         .toBe('Year');

    //     // And the grid cell at "0", "1" has text "Profit"
    //     await since('The grid cell at "0", "1" should have text "Profit", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //         .toBe('Profit');

    //     // And the grid cell at "1", "0" has text "2015"
    //     await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //         .toBe('2015');

    //     // And the grid cell at "1", "1" has text "$183,548"
    //     await since('The grid cell at "1", "1" should have text "$183,548", instead we have #{actual}')
    //         .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //         .toBe('$183,548');

    //     // When I add the object "Subcategory" to Page-by from In Report tab in Report Editor
    //     // await reportDatasetPanel.openObjectContextMenu('Subcategory');
    //     // await reportDatasetPanel.clickObjectContextMenuItem('Add to Page-by');
    //     await reportDatasetPanel.addObjectToPageBy('Subcategory');

    //     // // And The current selection for page by selector "Subcategory" should be "Audio Equipment"
    //     // await since(
    //     //     'The current selection for page by selector "Subcategory" should be "Audio Equipment", instead we have #{actual}'
    //     // )
    //     //     .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
    //     //     .toBe('Audio Equipment');

    //     // // And the grid cell at "1", "0" has text "2016"
    //     // await since('The grid cell at "1", "0" should have text "2016", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //     //     .toBe('2016');

    //     // // And the grid cell at "1", "1" has text "$36,761"
    //     // await since('The grid cell at "1", "1" should have text "$36,761", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //     //     .toBe('$36,761');

    //     // // When I open the dropdown list for page by selector "Subcategory"
    //     // await reportPageBy.openDropdownfromSelector('Subcategory');

    //     // // Then The index of element "Audio Equipment" is 0 in page by selector
    //     // await since('The index of element "Audio Equipment" should be 0 in page by selector')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Audio Equipment'))
    //     //     .toBe('0');

    //     // // And The index of element "Cameras" is 1 in page by selector
    //     // await since('The index of element "Cameras" should be 1 in page by selector')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Cameras'))
    //     //     .toBe('1');

    //     // // And The index of element "Electronics - Miscellaneous" is 2 in page by selector
    //     // await since('The index of element "Electronics - Miscellaneous" should be 2 in page by selector')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Electronics - Miscellaneous'))
    //     //     .toBe('2');

    //     // // And The index of element "TV\'s" is 3 in page by selector
    //     // await since('The index of element "TV\'s" should be 3 in page by selector')
    //     //     .expect(await reportPageBy.getElementFromPopupList("TV's").getAttribute('index'))
    //     //     .toBe('3');

    //     // // And The index of element "Video Equipment" is 4 in page by selector
    //     // await since('The index of element "Video Equipment" should be 4 in page by selector')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Video Equipment'))
    //     //     .toBe('4');

    //     // When I sort descending the "attribute" "Subcategory" in "PageBy" dropzone in Editor Panel
    //     // await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Subcategory');
    //     // await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
    //     await reportEditorPanel.sortAscendingPageByDropZoneForAttribute('Subcategory');

    //     // // Then The current selection for page by selector "Subcategory" should be "Video Equipment", instead we have #{actual}
    //     // await since(
    //     //     'The current selection for page by selector "Subcategory" should be "Video Equipment", instead we have #{actual}'
    //     // )
    //     //     .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
    //     //     .toBe('Video Equipment');

    //     // // And the grid cell at "0", "0" has text "Year"
    //     // await since('The grid cell at "0", "0" should have text "Year", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(0, 0))
    //     //     .toBe('Year');

    //     // // And the grid cell at "0", "1" has text "Profit"
    //     // await since('The grid cell at "0", "1" should have text "Profit", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(0, 1))
    //     //     .toBe('Profit');

    //     // // And the grid cell at "1", "0" has text "2015"
    //     // await since('The grid cell at "1", "0" should have text "2015", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(1, 0))
    //     //     .toBe('2015');

    //     // // And the grid cell at "1", "1" has text "$63,897"
    //     // await since('The grid cell at "1", "1" should have text "$63,897", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(1, 1))
    //     //     .toBe('$63,897');

    //     // // And the grid cell at "2", "0" has text "2016"
    //     // await since('The grid cell at "2", "0" should have text "2016", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(2, 0))
    //     //     .toBe('2016');

    //     // // And the grid cell at "2", "1" has text "$74,318"
    //     // await since('The grid cell at "2", "1" should have text "$74,318", instead we have #{actual}')
    //     //     .expect(await reportGridView.getGridCellTextByPos(2, 1))
    //     //     .toBe('$74,318');

    //     // When I open the dropdown list for page by selector "Subcategory"
    //     await reportPageBy.openDropdownfromSelector('Subcategory');

    //     // // Then The index of element "Video Equipment" is 0 in page by selector
    //     // await since('The index of element "Video Equipment" should be 0 in page by selector, instead we have #{actual}')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Video Equipment'))
    //     //     .toBe('0');

    //     // // And The index of element "TV's" is 1 in page by selector
    //     // await since('The index of element "TV\'s" should be 1 in page by selector, instead we have #{actual}')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList("TV's"))
    //     //     .toBe('1');

    //     // // And The index of element "Electronics - Miscellaneous" is 2 in page by selector
    //     // await since(
    //     //     'The index of element "Electronics - Miscellaneous" should be 2 in page by selector, instead we have #{actual}'
    //     // )
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Electronics - Miscellaneous'))
    //     //     .toBe('2');

    //     // // And The index of element "Cameras" is 3 in page by selector
    //     // await since('The index of element "Cameras" should be 3 in page by selector, instead we have #{actual}')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Cameras'))
    //     //     .toBe('3');

    //     // // And The index of element "Audio Equipment" is 4 in page by selector
    //     // await since('The index of element "Audio Equipment" should be 4 in page by selector, instead we have #{actual}')
    //     //     .expect(await reportPageBy.getIndexForElementFromPopupList('Audio Equipment'))
    //     //     .toBe('4');

    //     // When I open drill menu for page by selector "Subcategory" in Report Editor
    //     await reportPageBy.openSelectorContextMenu('Subcategory');

    //     // // Then I can see drill element "Category" from page by selector in Report Editor
    //     // await since('Drill element "Category" should be visible')
    //     //     .expect(await reportGridView.getDrillToItem('Category').isDisplayed())
    //     //     .toBe(true);

    //     // // When I select hierarchy "Products" from page by selector in Report Editor
    //     // await reportGridView.clickDrillToItem('Products');

    //     // // Then I can see drill element "Category" from page by selector in Report Editor
    //     // await since('Drill element "Category" should be visible')
    //     //     .expect(await reportGridView.getDrillToItem('Category').isDisplayed())
    //     //     .toBe(true);

    //     // When I select hierarchy "Geography" from page by selector in Report Editor
    //     await reportGridView.clickDrillToItem('Geography');

    //     // Then I can see drill element "Employee" from page by selector in Report Editor
    //     await since('Drill element "Employee" should be visible')
    //         .expect(await reportGridView.getDrillToItem('Employee').isDisplayed())
    //         .toBe(true);

    //     // Then I can see drill element "Manager" from page by selector in Report Editor
    //     await since('Drill element "Manager" should be visible')
    //         .expect(await reportGridView.getDrillToItem('Manager').isDisplayed())
    //         .toBe(true);

    //     // Then I can see drill element "Region" from page by selector in Report Editor
    //     await since('Drill element "Region" should be visible')
    //         .expect(await reportGridView.getDrillToItem('Region').isDisplayed())
    //         .toBe(true);

    //     // When I select hierarchy "Cat - Region Hirarchy" from page by selector in Report Editor
    //     await reportGridView.clickDrillToItem('Cat - Region Hirarchy');

    //     // Then I can see drill element "Region" from page by selector in Report Editor
    //     await since('Drill element "Region" should be visible')
    //         .expect(await reportGridView.getDrillToItem('Region').isDisplayed())
    //         .toBe(true);

    //     // Then I can see drill element "Category" from page by selector in Report Editor
    //     await since('The drill element "Category" should be visible in the page by selector')
    //         .expect(await reportGridView.getDrillToItem('Category').isDisplayed())
    //         .toBe(true);

    //     // When I switch to "Filter" Panel in Report Editor
    //     await reportTOC.switchToFilterPanel();

    //     // And I switch to "View Filter" filter tab from Filter panel in Report Editor
    //     await reportFilterPanel.switchToViewFilterTab();

    //     // When I switch to SQL view in Report Editor
    //     await reportToolbar.switchToSqlView();

    //     // When I move the vertical scrollbar in Report by offset "30%" down
    //     await reportSqlView.dndVerticalScrollbar('30%');

    //     // Then The sql content should contain "select  [Subcategory]@[SUBCAT_ID],     [Subcategory]@[SUBCAT_DESC],     [Year]@[YEAR_ID],     sum([[F_MAIN_INDEX].Profit])@{[Subcategory],[Year]} as [Profit] from    IC - CF and CL with Table Join Tree:   [F_MAIN_INDEX]"
    //     await since('The SQL content should contain the expected query')
    //         .expect(await reportSqlView.sqlView.getText())
    //         .toContain(
    //             'select  [Subcategory]@[SUBCAT_ID],     [Subcategory]@[SUBCAT_DESC],     [Year]@[YEAR_ID],     sum([[F_MAIN_INDEX].Profit])@{[Subcategory],[Year]} as [Profit] from    IC - CF and CL with Table Join Tree:   [F_MAIN_INDEX]'
    //         );
    // });

    it('[TC85100_12] Report editor subset TC85100 Case 13 IC_CFCL_SR in workstation', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.IC_CFCL_SR.id,
            projectId: reportConstants.IC_CFCL_SR.project.id,
        });
        // // Then the dataset panel should not contain "In Report" tab in Report Editor
        // await since('The dataset panel should not contain "In Report" tab in Report Editor')
        //     .expect(await reportDatasetPanel.getTab('In Report').isDisplayed())
        //     .toBe(false);

        // And the dataset panel should not contain "All" tab in Report Editor
        await since('The dataset panel should not contain "All" tab in Report Editor')
            .expect(await reportDatasetPanel.getTab('All').isDisplayed())
            .toBe(false);

        // And I will see object "Cost" in In Report tab in Report Editor
        await since('I will see object "Cost" in In Report tab in Report Editor')
            .expect(await reportDatasetPanel.getObjectInReportTab('Cost').isDisplayed())
            .toBe(true);

        // When I open the object "Cost" context menu from Object Panel in Report Editor
        await reportDatasetPanel.openObjectContextMenu('Cost');

        // Then the context menu option should not contain "Remove from Report" from Object Panel in Report Editor
        await since(
            'The context menu option should not contain "Remove from Report" from Object Panel in Report Editor'
        )
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Remove from Report').isDisplayed())
            .toBe(false);

        // When I click to close report editor context menu
        await reportDatasetPanel.clickToCloseContextMenu();

        // And I create metric for object "Cost" from In Report tab in Report Editor
        await reportDatasetPanel.openObjectContextMenu('Cost');
        await reportDatasetPanel.clickObjectContextMenuItem('Create Metric...');
        // When I click on the Switch to "Formula" Editor button of DM Editor
        await reportDerivedMetricEditor.switchToFormulaMode();
        // Then "Sum(Cost){~+}" is displayed on the "Input" section of the Metrics panel
        await since('"Sum(Cost){~+}" is displayed on the "Input" section of the Metrics panel')
            .expect(await reportDerivedMetricEditor.getMetricDefinition())
            .toBe('Sum(Cost){~+}');

        // When I click on the "Save" button of DM Editor
        await reportDerivedMetricEditor.saveMetric();

        // And I will see object "New Metric" in In Report tab in Report Editor
        await since('I will see object "New Metric" in In Report tab in Report Editor')
            .expect(await reportDatasetPanel.getObjectInReportTab('New Metric').isDisplayed())
            .toBe(true);

        // And "metric" object "New Metric" should be added to "Metrics" dropzone in Editor Panel
        await since('"metric" object "New Metric" should be added to "Metrics" dropzone in Editor Panel')
            .expect(await reportEditorPanel.getObjectInDropzone('Metrics', 'metric', 'New Metric').isDisplayed())
            .toBe(true);

        // When I open the object "New Metric" context menu from Object Panel in Report Editor
        await reportDatasetPanel.openObjectContextMenu('New Metric');

        // Then the context menu option should contain "Remove from Report" from Object Panel in Report Editor
        await since('the context menu option should contain "Remove from Report" from Object Panel in Report Editor')
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Remove from Report').isDisplayed())
            .toBe(true);

        // And the context menu option should contain "Edit..." from Object Panel in Report Editor
        await since('the context menu option should contain "Edit..." from Object Panel in Report Editor')
            .expect(await reportDatasetPanel.getObjectContextMenuItem('Edit...').isDisplayed())
            .toBe(true);

        // // When I ctrl select "Cost" and "New Metric" from Objects Panel in Report Editor
        // await reportDatasetPanel.multiSelectObjects('Cost', 'New Metric');

        // // And I open the object "New Metric" context menu from Object Panel in Report Editor
        // await reportDatasetPanel.openObjectContextMenu('New Metric');
        // // Then the context menu option should not contain "Remove from Report" from Object Panel in Report Editor
        // await since(
        //     'The context menu option should not contain "Remove from Report" from Object Panel in Report Editor'
        // )
        //     .expect(await reportDatasetPanel.getObjectContextMenuItem('Remove from Report').isDisplayed())
        //     .toBe(false);

        // // When I click to close report editor context menu
        // await reportDatasetPanel.clickToCloseContextMenu();

        // // And I reset selection to "New Metric" from Objects Panel in Report Editor
        // await reportDatasetPanel.resetSelectionToObjectInReportTab('New Metric');

        // And I remove object "New Metric" from Report in Report Editor
        // await reportDatasetPanel.openObjectContextMenu('New Metric');
        // await reportDatasetPanel.clickObjectContextMenuItem('Remove from Report');
        // await reportDatasetPanel.removeItemInReportTab('New Metric');

        // // Then I will not see object "New Metric" in In Report tab in Report Editor
        // await since('The object "New Metric" should not be visible in In Report tab in Report Editor')
        //     .expect(await reportDatasetPanel.getObjectInReportTab('New Metric').isDisplayed())
        //     .toBe(false);
    });
});
