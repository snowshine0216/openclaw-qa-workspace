import { AGGridSpecialNumberFormat1, AGGridSpecialNumberFormat2, gridUser } from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { expectResult } from '../../../utils/ExpectUtils.js';

describe('Special Number Formatting for SSN, zipcode and telephone in modern grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        libraryPage,
        loadingDialog,
        datasetsPanel,
        datasetPanel,
        agGridVisualization,
        editorPanelForGrid,
        contentsPanel,
        vizPanelForGrid,
        showDataDialog,
        dossierMojo,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC88592] Sanity - Special number formatting for SSN, telephone and zipcode in Ag Grid', async () => {
        // Open dossier in editr mode
        await libraryPage.editDossierByUrl({
            projectId: AGGridSpecialNumberFormat1.project.id,
            dossierId: AGGridSpecialNumberFormat1.id,
        });

        // When I right click on element "Salary" and select "Number Format" from ag-grid "Employee Grid"
        await agGridVisualization.openContextMenuItemForHeader('Salary', 'Number Format', 'Employee Grid');

        // And I opened Number Format context submenu
        await vizPanelForGrid.clickNumberFormatDropdownOption();

        // Then The "Special" option "is not" displayed in the context menu of the selected element
        await since('The "Special" option should not be displayed in the context menu of the selected element')
            .expect(await editorPanelForGrid.getContextMenuOption('Special').isExisting())
            .toBe(false);

        // When I right click on "metric" named "Salary" from dataset "lu_employee lu_supplier (2 tables)" and select "Number Format"
        await datasetPanel.actionOnObjectFromDataset(
            'Salary',
            'metric',
            'lu_employee lu_supplier (2 tables)',
            'Number Format'
        );

        // And I opened Number Format context submenu
        await vizPanelForGrid.clickNumberFormatDropdownOption();

        // Then The "Special" option "is not" displayed in the context menu of the selected element
        await since('The "Special" option should not be displayed in the context menu of the selected element')
            .expect(await editorPanelForGrid.getContextMenuOption('Special').isExisting())
            .toBe(false);

        // When I right click on "attribute" named "Emp Ssn" from dataset "lu_employee lu_supplier (2 tables)" and select "Number Format"
        await datasetPanel.actionOnObjectFromDataset(
            'Emp Ssn',
            'attribute',
            'lu_employee lu_supplier (2 tables)',
            'Number Format'
        );
        // And I select "Special" from the drop down in the Number Format context menu
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Special');

        // Then the value format drop down "is" displayed in the Number Format context menu
        await since('value format drop down should be displayed')
            .expect(await vizPanelForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);

        // When I select value format "Social Security Number" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfValueFormatFromDropdown('Social Security Number');

        // And I click the "OK" button in the context menu to close it
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the grid cell in ag-grid "Employee Grid" at "1", "2" has text "089-11-8610"
        await expectResult(
            'grid cell in ag-grid "Employee Grid" at "1", "2" should have text "089-11-8610"',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Employee Grid').getText()
        ).toBe('089-11-8610');

        // When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 2' });
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await expectResult(
            'Page "Page 2" in chapter "Chapter 1" should be the current page',
            await contentsPanel.getCurrentPage('Page 2', 'Chapter 1').isDisplayed()
        ).toBe(true);

        // And the grid cell in ag-grid "Supplier Grid" at "1", "1" has text "9075550166"
        await expectResult(
            'grid cell in ag-grid "Supplier Grid" at "1", "1" should have text "9075550166"',
            await agGridVisualization.getGridCellByPosition(2, 2, 'Supplier Grid').getText()
        ).toBe('9075550166');

        // And the grid cell in ag-grid "Supplier Grid" at "1", "2" has text "33475"
        await expectResult(
            'grid cell in ag-grid "Supplier Grid" at "1", "2" should have text "33475"',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Supplier Grid').getText()
        ).toBe('33475');

        // When I right click on element "Supplier Phone Number 1" and select "Number Format" from ag-grid "Supplier Grid"
        await agGridVisualization.openContextMenuItemForHeader(
            'Supplier Phone Number 1',
            'Number Format',
            'Supplier Grid'
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // And I select "Special" from the drop down in the Number Format context menu
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Special');

        // Then the value format drop down "is" displayed in the Number Format context menu
        await since('The value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);

        // When I select value format "Phone Number (123) 456-7890" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfValueFormatFromDropdown('Phone Number (123) 456-7890');

        // And I click the "OK" button in the context menu to close it
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the grid cell in ag-grid "Supplier Grid" at "1", "1" has text "(907) 555-0166"
        await expectResult(
            'Grid cell in ag-grid "Supplier Grid" at "1", "1" should have text "(907) 555-0166"',
            await agGridVisualization.getGridCellByPosition(2, 2, 'Supplier Grid').getText()
        ).toBe('(907) 555-0166');

        // When I right click on value "(907) 555-0166" and select "Number Format" from ag-grid "Supplier Grid"
        await agGridVisualization.openContextMenuItemForValue('(907) 555-0166', 'Number Format', 'Supplier Grid');

        // Then the value format drop down "is" displayed in the Number Format context menu
        await since('Value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);

        // When I select value format "Phone Number 123-456-7890" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfValueFormatFromDropdown('Phone Number (123) 456-7890');

        // And I click the "OK" button in the context menu to close it
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the grid cell in ag-grid "Supplier Grid" at "1", "1" has text "907-555-0166"
        await expectResult(
            'Grid cell in ag-grid "Supplier Grid" at "1", "1" should have text "907-555-0166"',
            await agGridVisualization.getGridCellByPosition(2, 2, 'Supplier Grid').getText()
        ).toBe('(907) 555-0166');
        // When I right click on object "Zipcode 1" from dropzone "Rows" and select "Number Format"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Zipcode 1', 'Rows', 'Number Format');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // And I select "Special" from the drop down in the Number Format context menu
        await agGridVisualization.visualizationForGrid.selectNumberFormatFromDropdown('Special');

        // Then the value format drop down "is" displayed in the Number Format context menu
        await since('Value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);

        // When I select value format "Extended Zip Code" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfValueFormatFromDropdown('Extended Zip Code');

        // And I click the "OK" button in the context menu to close it
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the grid cell in ag-grid "Supplier Grid" at "1", "2" has text "00003-3475"
        await expectResult(
            'Grid cell in ag-grid "Supplier Grid" at "1", "2" should have text "00003-3475"',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Supplier Grid').getText()
        ).toBe('00003-3475');

        // When I right click on value "00003-3475" and select "Number Format" from ag-grid "Supplier Grid"
        await agGridVisualization.openContextMenuItemForValue('00003-3475', 'Number Format', 'Supplier Grid');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then the value format drop down "is" displayed in the Number Format context menu
        await since('Value format drop down should be displayed in the Number Format context menu')
            .expect(await agGridVisualization.visualizationForGrid.getNfValueFormatPulldown().isDisplayed())
            .toBe(true);

        // When I select value format "Zip Code" from the drop down in the Number Format context menu
        await vizPanelForGrid.selectNfValueFormatFromDropdown('Zip Code');

        // And I click the "OK" button in the context menu to close it
        await agGridVisualization.clickOnElementByInjectingScript(
            await agGridVisualization.common.getContextMenuButton('OK')
        );
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then the grid cell in ag-grid "Supplier Grid" at "1", "2" has text "33475"
        await expectResult(
            `Grid cell in ag-grid "Supplier Grid" at "1", "2" should have text "33475"`,
            await agGridVisualization.getGridCellByPosition(2, 3, 'Supplier Grid').getText()
        ).toBe('33475');
    });

    it('[TC88597] Special number formatting for SSN, telephone and zipcode in Ag Grid | X-Functionality', async () => {
        // When I open dossier by its ID "0FD00918204EDF7CCC7D5693AEFEB899"
        await libraryPage.editDossierByUrl({
            projectId: AGGridSpecialNumberFormat2.project.id,
            dossierId: AGGridSpecialNumberFormat2.id,
        });

        // When I right click on object "Emp Ssn" from dropzone "Rows" and select "Remove"
        await vizPanelForGrid.selectContextMenuOptionFromObjectinDZ('Emp Ssn', 'Rows', 'Remove');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // Then The editor panel should not have "attribute" named "Emp Ssn" on "Rows" section
        await since('The editor panel should not have "attribute" named "Emp Ssn" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Emp Ssn', 'attribute', 'Rows').isExisting())
            .toBe(false);

        // When I add "attribute" named "Emp Ssn" from dataset "lu_employee lu_supplier (2 tables)" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Emp Ssn', 'attribute', 'lu_employee lu_supplier (2 tables)');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // Then The editor panel should have "attribute" named "Emp Ssn" on "Rows" section
        await since('The editor panel should have "attribute" named "Emp Ssn" on "Rows" section')
            .expect(await editorPanelForGrid.getObjectFromSection('Emp Ssn', 'attribute', 'Rows').isExisting())
            .toBe(true);

        // And the grid cell in ag-grid "Employee Grid" at "1", "2" has text "089-11-8610"
        await expectResult(
            'The grid cell in ag-grid "Employee Grid" at "2", "3" should have text "089-11-8610"',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Employee Grid').getText()
        ).toBe('089-11-8610');

        // When I switch to page "Page 2" in chapter "Chapter 1" from contents panel
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page 2',
        });

        // Then Page "Page 2" in chapter "Chapter 1" is the current page
        await since('Page "Page 2" in chapter "Chapter 1" should be the current page')
            .expect(await contentsPanel.getCurrentPage('Page 2', 'Chapter 1').isExisting())
            .toBe(true);
        // When I open the Show Data dialog for the visualization "Supplier Grid"
        await agGridVisualization.openContextMenu('Supplier Grid');
        await agGridVisualization.selectContextMenuOption('Show Data');
        await since('An editor with title "Show Data" should be displayed')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        // Then The show data grid has element "907-555-0166"
        await expectResult(
            'The show data grid should have 907-555-0166',
            await showDataDialog.getObjectForShowDataGrid('907-555-0166').isDisplayed()
        ).toBe(true);

        // And The show data grid has element "00003-3475"
        await expectResult(
            'The show data grid should have 00003-3475',
            await showDataDialog.getObjectForShowDataGrid('00003-3475').isDisplayed()
        ).toBe(true);

        // And I close the show data dialog
        await showDataDialog.closeShowDataDialog();

        // When I duplicate container "Supplier Grid" through the context menu
        await agGridVisualization.duplicateContainer('Supplier Grid');

        // Then The container "Supplier Grid copy" should be selected
        await since('The container Supplier Grid copy should be selected')
            .expect(await agGridVisualization.getSelectedContainer('Supplier Grid copy').isExisting())
            .toBe(true);

        // And the grid cell in ag-grid "Supplier Grid copy" at "2", "2" has text "907-555-0166"
        await expectResult(
            'The grid cell in ag-grid Supplier Grid copy at 2, 2 should have 907-555-0166',
            await agGridVisualization.getGridCellByPosition(2, 2, 'Supplier Grid copy').getText()
        ).toBe('907-555-0166');

        // And the grid cell in ag-grid "Supplier Grid copy" at "2", "3" has text "00003-3475"
        await expectResult(
            'The grid cell in ag-grid Supplier Grid copy at 2, 3 should have 00003-3475',
            await agGridVisualization.getGridCellByPosition(2, 3, 'Supplier Grid copy').getText()
        ).toBe('00003-3475');

        // When I change visualization "Supplier Grid copy" to "Grid" from context menu
        await agGridVisualization.changeViz('Grid', 'Supplier Grid copy');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        // await browser.debug()
        // Then the grid cell in visualization "Supplier Grid copy" at 2, 2 has text "907-555-0166"
        await expectResult(
            'The grid cell in visualization Supplier Grid copy at 2, 2 should have 907-555-0166',
            await (await vizPanelForGrid.getGridCellByPosition(2, 2, 'Supplier Grid copy')).getText()
        ).toBe('907-555-0166');
        // And the grid cell in visualization "Supplier Grid copy" at "2", "3" has text "00003-3475"
        await expectResult(
            'The grid cell in visualization Supplier Grid copy at 2, 3 should have 00003-3475',
            await (await vizPanelForGrid.getGridCellByPosition(2, 3, 'Supplier Grid copy')).getText()
        ).toBe('00003-3475');
    });
});
