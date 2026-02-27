import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Page By - Part 1', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        reportPageBy,
        reportEditorPanel,
        reportFilterPanel,
        reportAttributeFormsDialog,
        reportTOC,
        dossierEditorUtility,
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

    it('[TC81156_1] FUN | Report Editor | Editor Panel | Page-by', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);

        await reportDatasetPanel.addMultipleObjectsToPageBy(['Region', 'Manager', 'Employee']);

        // And I add the object "Call Center" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Call Center');

        // And I click folder up icon to go back to upper level folder in Report Editor
        await reportDatasetPanel.clickFolderUpIcon();

        // And I select folder "Products" in object list in Report Editor
        await reportDatasetPanel.selectItemInObjectList('Products');

        // And I add the object "Category" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Category');

        await reportDatasetPanel.clickFolderUpMultipleTimes(3);

        await reportDatasetPanel.selectMultipleItemsInObjectList([
            'Public Objects',
            'Metrics',
            'Sales Metrics',
            'Testing',
        ]);

        await reportDatasetPanel.addMultipleObjectsToColumns(['Profit per Employee', 'Revenue per Employee']);

        // And I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Region" should be "Central"
        await since(
            'After switch to Design mode, The current selection for page by selector "Region" should be "Central", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Central');

        // And The current selection for page by selector "Manager" should be "Lewandowski:Allister"
        await since(
            'After switch to Design mode, The current selection for page by selector "Manager" should be "Lewandowski:Allister", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Lewandowski:Allister');

        // And The current selection for page by selector "Employee" should be "Gale:Loren"
        await since(
            'After switch to Design mode, The current selection for page by selector "Employee" should be "Gale:Loren", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Employee'))
            .toBe('Gale:Loren');

        await takeScreenshotByElement(reportGridView.grid, 'TC81156_1', 'switch to Design mode', { tolerance: 0.3 });

        // When I sort descending the "attribute" "Region" in "PageBy" dropzone in Editor Panel
        // await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Region');
        // await reportDatasetPanel.clickObjectContextMenuItem('Sort Descending');
        await reportEditorPanel.sortDescendingPageByDropZoneForAttribute('Region');
        await takeScreenshotByElement(
            dossierEditorUtility.getVIVizPanel(),
            'TC81156_1',
            'sort descending the "attribute" "Region" in "PageBy" dropzone in Editor Panel',
            { tolerance: 0.2 }
        );

        // When I open attribute forms dialog from the "attribute" "Manager" in "PageBy" dropzone in Report Editor
        await reportEditorPanel.openObjectContextMenu('PageBy', 'attribute', 'Manager');
        await reportDatasetPanel.clickObjectContextMenuItem('Display Attribute Forms');

        // And I click the checkbox to use the default list of attribute forms
        await reportAttributeFormsDialog.clickDefaultFormCheckBox();

        // And I click attribute forms "Email" in Display Attribute Forms list
        await reportAttributeFormsDialog.enableDisplayAttributeForms(['Email']);

        // Then The current selection for page by selector "Region" should be "Web"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The current selection for page by selector "Region" should be "Web", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Web');

        // And The current selection for page by selector "Manager" should be "Cooper:Alice:acooper@microstrategy-tutorial.demo"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The current selection for page by selector "Manager" should be "Cooper:Alice:acooper@microstrategy-tutorial.demo", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Cooper:Alice:acooper@microstrategy-tutorial.demo');

        // And The current selection for page by selector "Employee" should be "Walker:Robert"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The current selection for page by selector "Employee" should be "Walker:Robert", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Employee'))
            .toBe('Walker:Robert');
        // And the grid cell at "0", "0" has text "Call Center"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "0", "0" should have text "Call Center", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Call Center');

        // And the grid cell at "0", "1" has text "Web"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "0", "1" should have text "Web", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Web');

        // And the grid cell at "1", "0" has text "Category"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "1", "0" should have text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Category');

        // And the grid cell at "1", "1" has text "Profit per Employee"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "1", "1" should have text "Profit per Employee", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Profit per Employee');

        // And the grid cell at "2", "0" has text "Books"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "2", "0" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Books');

        // And the grid cell at "2", "1" has text "$63,070"
        await since(
            'After enable attribute forms for "Manager" in "PageBy" dropzone in Report Editor, The grid cell at "2", "1" should have text "$63,070", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$63,070');

        // When I select element "Southeast" from Page by selector "Region"
        await reportPageBy.changePageByElement('Region', 'Southeast');

        // Then The current selection for page by selector "Region" should be "Southeast"
        await since(
            'After select element "Southeast" from Page by selector "Region", The current selection for page by selector "Region" should be "Southeast", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Southeast');
        // And The current selection for page by selector "Manager" should be "Austin:Tilda:taustin@microstrategy-tutorial.demo"
        await since(
            'After select element "Southeast" from Page by selector "Region", The current selection for page by selector "Manager" is expected to be Austin:Tilda:taustin@microstrategy-tutorial.demo, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Austin:Tilda:taustin@microstrategy-tutorial.demo');

        // And The current selection for page by selector "Employee" should be "Lynch:Sam"
        await since(
            'After select element "Southeast" from Page by selector "Region", The current selection for page by selector "Employee" is expected to be Lynch:Sam, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Employee'))
            .toBe('Lynch:Sam');

        // And the grid cell at "0", "0" has text "Call Center"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "0", "0" is expected to have text Call Center, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Call Center');

        // And the grid cell at "0", "1" has text "Miami"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "0", "1" is expected to have text Miami, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Miami');

        // And the grid cell at "1", "0" has text "Category"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "1", "0" is expected to have text Category, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Category');

        // And the grid cell at "1", "1" has text "Profit per Employee"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "1", "1" is expected to have text Profit per Employee, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Profit per Employee');

        // And the grid cell at "2", "0" has text "Books"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "2", "0" is expected to have text Books, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Books');

        // And the grid cell at "2", "1" has text "$9,887"
        await since(
            'After select element "Southeast" from Page by selector "Region", The grid cell at "2", "1" is expected to have text $9,887, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$9,887');
        await reportPageBy.openDropdownFromSelector('Manager');

        // Then The page by selector "Manager" dropdown list has element "Austin:Tilda:taustin@microstrategy-tutorial.demo"
        await since(
            'After open the dropdown list for page by selector "Manager", The page by selector "Manager" dropdown list should have element "Austin:Tilda:taustin@microstrategy-tutorial.demo", instead we have different element'
        )
            .expect(await reportPageBy.getElementFromPopupList('Austin:Tilda:taustin@microstrategy-tutorial.demo'))
            .toBeTruthy();

        // And The page by selector "Manager" dropdown list has element "Rosie:Calvin:crosie@microstrategy-tutorial.demo"
        await since(
            'After open the dropdown list for page by selector "Manager",  The page by selector "Manager" dropdown list should have element "Rosie:Calvin:crosie@microstrategy-tutorial.demo", instead we have different element'
        )
            .expect(await reportPageBy.getElementFromPopupList('Rosie:Calvin:crosie@microstrategy-tutorial.demo'))
            .toBeTruthy();

        // When I open the dropdown list for page by selector "Employee"
        await reportPageBy.openDropdownFromSelector('Employee');

        // Then The page by selector "Employee" dropdown list has element "Lynch:Sam"
        await since(
            'After open the dropdown list for page by selector "Employee", The page by selector "Employee" dropdown list should have element "Lynch:Sam", instead we have different element'
        )
            .expect(await reportPageBy.getElementFromPopupList('Lynch:Sam'))
            .toBeTruthy();

        // And The page by selector "Employee" dropdown list has element "Strome:Fred"
        await since(
            'After open the dropdown list for page by selector "Employee", The page by selector "Employee" dropdown list should have element "Strome:Fred", instead we have different element'
        )
            .expect(await reportPageBy.getElementFromPopupList('Strome:Fred'))
            .toBeTruthy();
    });

    it('[TC81156_2] FUN | Report Editor | Editor Panel | Page-by', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.PageByMetricPB.id,
            projectId: reportConstants.PageByMetricPB.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // Then The current selection for page by selector "Metrics" should be "Profit"
        await since('The current selection for page by selector "Metrics" should be "Cost", instead we have #{actual}')
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toBe('Cost');

        // When I open the dropdown list for page by selector "Metrics"
        await reportPageBy.openDropdownFromSelector('Metrics');

        // Then The page by selector "Metrics" dropdown list has element "Profit"
        await since(
            'The page by selector "Metrics" dropdown list should have element "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Profit').isDisplayed())
            .toBe(true);

        // And The page by selector "Metrics" dropdown list has element "DM Revenue"
        await since(
            'The page by selector "Metrics" dropdown list should have element "DM Revenue", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Revenue').isDisplayed())
            .toBe(true);

        // And The page by selector "Metrics" dropdown list has element "Cost"
        await since(
            'The page by selector "Metrics" dropdown list should have element "Cost", instead we have #{actual}'
        )
            .expect(await reportPageBy.getElementFromPopupList('Profit').isDisplayed())
            .toBe(true);

        // And the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Subcategory"
        await since('The grid cell at "0", "1" should have text "Subcategory", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Subcategory');

        // And the grid cell at "0", "2" has text "Item"
        await since('The grid cell at "0", "2" should have text "Item", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Item');
        // And the grid cell at "0", "3" has text "Profit"
        await since('The grid cell at "0", "3" should have text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');

        // When I select element "DM Revenue" from Page by selector "Metrics"
        await reportPageBy.changePageByElement('Metrics', 'Revenue');

        // And the grid cell at "0", "0" has text "Category"
        await since('The grid cell at "0", "0" should have text "Category", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Category');

        // And the grid cell at "0", "1" has text "Subcategory"
        await since('The grid cell at "0", "1" should have text "Subcategory", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Subcategory');

        // And the grid cell at "0", "2" has text "Item"
        await since('The grid cell at "0", "2" should have text "Item", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Item');

        // And the grid cell at "0", "3" has text "DM Revenue"
        await since('The grid cell at "0", "3" should have text "DM Revenue", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Revenue');

        // And the grid cell at "1", "0" has text "Books"
        await since('The grid cell at "1", "0" should have text "Books", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Books');

        // And the grid cell at "1", "1" has text "Art & Architecture"
        await since('The grid cell at "1", "1" should have text "Art & Architecture", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Art & Architecture');

        // And the grid cell at "1", "2" has text "100 Places to Go While Still Young at Heart"
        await since(
            'The grid cell at "1", "2" should have text "100 Places to Go While Still Young at Heart", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('100 Places to Go While Still Young at Heart');

        // And the grid cell at "1", "3" has text "67,993"
        await since('The grid cell at "1", "3" should have text "67,993", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('67,993');
    });

    it('[TC81156_3] FUN | Report Editor | Editor Panel | Page-by', async () => {
        await libraryPage.createNewReportByUrl({});

        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);

        // And I add the object "Call Center" to Rows from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToRows('Call Center');

        await reportDatasetPanel.addMultipleObjectsToPageBy(['Region', 'Manager', 'Employee']);

        await reportDatasetPanel.clickFolderUpMultipleTimes(3);

        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);

        // And I add the object "Cost" to Columns from Object Browser in Report Editor
        await reportDatasetPanel.addObjectToColumns('Cost');

        // And I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // Then The current selection for page by selector "Region" should be "Central"
        await since(
            'The current selection for page by selector "Region" is expected to be Central, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Central');

        // And The current selection for page by selector "Manager" should be "Lewandowski:Allister"
        await since(
            'The current selection for page by selector "Manager" is expected to be Lewandowski:Allister, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Lewandowski:Allister');

        // And The current selection for page by selector "Employee" should be "Gale:Loren"
        await since(
            'The current selection for page by selector "Employee" is expected to be Gale:Loren, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Employee'))
            .toBe('Gale:Loren');

        // And the grid cell at "1", "0" has text "Milwaukee"
        await since('The grid cell at "1", "0" is expected to have text Milwaukee, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Milwaukee');

        // And the grid cell at "1", "1" has text "$1,416,036"
        await since('The grid cell at "1", "1" is expected to have text $1,416,036, instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$1,416,036');

        // When I switch to "Filter" Panel in Report Editor
        await reportTOC.switchToFilterPanel();

        // And I click the plus button to open a new qualification editor in Filter panel at non-aggregation level in Report Editor
        await reportFilterPanel.openNewQualicationEditorAtNonAggregationLevel();

        // And I search "Attribute" "Manager" in the based on search box and select the searched result
        // await reportFilterPanel.typeObjectInSearchbox('Manager');
        // await reportFilterPanel.selectObjectFromSearchedResult('Attribute', 'Manager');
        await reportFilterPanel.searchAttributeObjectInSearchbox('Manager');

        // And I select "Aoter:Barbara,Ritholtz:Cecelia,Missner:Galvin,Snyderman:Reba,Becker:Cornelius" in the elements list
        await reportFilterPanel.selectElements([
            'Aoter:Barbara',
            'Ritholtz:Cecelia',
            'Missner:Galvin',
            'Snyderman:Reba',
            'Becker:Cornelius',
        ]);

        // And I click "Done" button to close the qualification editor
        await reportFilterPanel.saveAndCloseQualificationEditor();

        // And I click Apply button to submit the Filters
        await reportFilterPanel.clickFilterApplyButton();
        await reportFilterPanel.sleep(reportConstants.sleepTimeForAssertion);

        // Then The current selection for page by selector "Region" should be "Mid-Atlantic"
        await since(
            'The current selection for page by selector "Region" should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toBe('Mid-Atlantic');

        // And The current selection for page by selector "Manager" should be "Snyderman:Reba"
        await since(
            'The current selection for page by selector "Manager" should be "Snyderman:Reba", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toBe('Snyderman:Reba');

        // And The current selection for page by selector "Employee" should be "Brown:Vernon"
        await since(
            'The current selection for page by selector "Employee" should be "Brown:Vernon", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Employee'))
            .toBe('Brown:Vernon');

        // And the grid cell at "1", "0" has text "Charleston"
        await since('The grid cell at "1", "0" should have text "Charleston", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Charleston');

        // And the grid cell at "1", "1" has text "$280,504"
        await since('The grid cell at "1", "1" should have text "$280,504", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$280,504');
    });

    it('[TC81156_4] FUN | Report Editor | Editor Panel | Page-by', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TC86195_wrap_text2.id,
            projectId: reportConstants.TC86195_wrap_text2.project.id,
        });
        await reportToolbar.switchToDesignMode();
        // When I select element "Profit" from Page by selector "Metrics"
        await reportPageBy.changePageByElement('Metrics', 'Profit');

        // Then The current selection for page by selector "Category" should be "Books"
        await since(
            'The current selection for page by selector "Category" should be "Books", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toContain('Books');

        // And The current selection for page by selector "Region" should be "Central"
        await since(
            'The current selection for page by selector "Region" should be "Central", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Region'))
            .toContain('Central');

        // And The current selection for page by selector "Manager" should be "Lewandowski:Allister:alewandowski@microstrategy-tutorial.demo"
        await since(
            'The current selection for page by selector "Manager" should be "Lewandowski:Allister:alewandowski@microstrategy-tutorial.demo", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Manager'))
            .toContain('Lewandowski:Allister:alewandowski@microstrategy-tutorial.demo');

        // And The current selection for page by selector "Metrics" should be "Profit"
        await since(
            'The current selection for page by selector "Metrics" should be "Profit", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Metrics'))
            .toContain('Profit');

        // And the grid cell at "0", "0" has text "Employee"
        await since('The grid cell at "0", "0" should have text "Employee", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Employee');

        // And the grid cell at "0", "1" has text ""
        await since('The grid cell at "0", "1" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('');

        // And the grid cell at "0", "2" has text ""
        await since('The grid cell at "0", "2" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('');
        // And the grid cell at "0", "3" has text "Profit"
        await since('The grid cell at "0", "3" should have text "Profit", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Profit');

        // And the grid cell at "1", "0" has text "Gale"
        await since('The grid cell at "1", "0" should have text "Gale", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Gale');

        // And the grid cell at "1", "1" has text "Loren"
        await since('The grid cell at "1", "1" should have text "Loren", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Loren');

        // And the grid cell at "1", "2" has text "096830288"
        await since('The grid cell at "1", "2" should have text "096830288", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('096830288');

        // And the grid cell at "1", "3" has text "$27,027"
        await since('The grid cell at "1", "3" should have text "$27,027", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$27,027');
    });

    it('[TC81156_5] FUN | Report Editor | Editor Panel | Page-by', async () => {
        // When I open report by its ID "1F073B75744758A713128988DBFB0B43"
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.PageBySubtotal3.id,
            projectId: reportConstants.PageBySubtotal3.project.id,
        });

        // And I switch to design mode in Report Editor
        await reportToolbar.switchToDesignMode();

        // When I select element "Total" from Page by selector "Category"
        await reportPageBy.changePageByElement('Category', 'Total');

        // Then The current selection for page by selector "Category" should be "Total"
        await since(
            'The current selection for page by selector "Category" should be "Total", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Total');

        // And The current selection for page by selector "Subcategory" should be "Art & Architecture"
        await since(
            'The current selection for page by selector "Subcategory" should be "Art & Architecture", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Art & Architecture');
        // And the grid cell at "1", "0" has text "Total"
        await since('The grid cell at "1", "0" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');

        // And the grid cell at "1", "1" has text "$370,161"
        await since('The grid cell at "1", "1" should have text "$370,161", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$370,161');

        // And the grid cell at "1", "2" has text "$110,012"
        await since('The grid cell at "1", "2" should have text "$110,012", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$110,012');

        // And the grid cell at "2", "0" has text "Average"
        await since('The grid cell at "2", "0" should have text "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Average');

        // And the grid cell at "2", "1" has text ""
        await since('The grid cell at "2", "1" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('');

        // And the grid cell at "2", "2" has text ""
        await since('The grid cell at "2", "2" should have text "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('');

        // When I select element "Average" from Page by selector "Category"
        await reportPageBy.changePageByElement('Category', 'Average');

        // Then The current selection for page by selector "Category" should be "Average"
        await since(
            'The current selection for page by selector "Category" should be "Average", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toBe('Average');

        // And The current selection for page by selector "Subcategory" should be "Average"
        await since(
            'The current selection for page by selector "Subcategory" should be "Average", instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Average');

        // And the grid cell at "1", "0" has text "Total"
        await since('The grid cell at "1", "0" should have text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');
        // And the grid cell at "1", "1" has text ""
        await since('The grid cell at "1", "1" should have "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('');

        // And the grid cell at "1", "2" has text ""
        await since('The grid cell at "1", "2" should have "", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('');

        // And the grid cell at "2", "0" has text "Average"
        await since('The grid cell at "2", "0" should have "Average", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('Average');

        // And the grid cell at "2", "1" has text "$82,584"
        await since('The grid cell at "2", "1" should have "$82,584", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$82,584');

        // And the grid cell at "2", "2" has text "$14,705"
        await since('The grid cell at "2", "2" should have "$14,705", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 2))
            .toBe('$14,705');
    });
});
