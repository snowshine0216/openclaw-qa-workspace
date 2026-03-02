import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import ShowDataDialog from '../../../pageObjects/common/ShowDataDialog.js';

describe('Compound Grid Display Attribute Forms and Context Menu Test', () => {
    let { loginPage, libraryPage, contentsPanel, vizPanelForGrid, editorPanelForGrid, showDataDialog, loadingDialog } =
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

    it('[TC167059_01] same attribute in column sets w/ different attribute forms displayed', async () => {
        // When I open dossier by its ID "FB8AEE8811EAA688703D0080EF554B3E"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_AttributeForms.project.id,
            dossierId: gridConstants.CompoundGrid_AttributeForms.id,
        });

        // CS 1 has DESC - the grid cell in visualization "Visualization 1" at "1", "3" has text "Bantam Books"
        await since('The grid cell in visualization "Visualization 1" at "1", "3" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '3', 'Visualization 1'))
            .toBe('Bantam Books');

        // CS 2 has ID - the grid cell in visualization "Visualization 1" at "1", "6" has text "101"
        await since('The grid cell in visualization "Visualization 1" at "1", "6" has text "101"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '6', 'Visualization 1'))
            .toBe('101');

        // Right click on "Supplier" and open "Display Attribute Forms"
        const supplier1 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 1');
        await editorPanelForGrid.rightClick({ elem: supplier1 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" and open "Display Attribute Forms"
        const supplier2 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClickOnElement(supplier2);
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        // Set Display Attribute Forms to "On" through More Options
        await editorPanelForGrid.setDisplayAttributeFormNames('On');
        await editorPanelForGrid.closeFormPopup('OK');

        // Verify grid cells show attribute form names (e.g., "Brand DESC")
        // Right click on "Brand DESC" element
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'Brand DESC',
            'Display Attribute Forms',
            'Visualization 1'
        );

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');
    });

    it('[TC167059_02] different attribute forms showing for 3 different CS', async () => {
        // Open dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_AttributeForms.project.id,
            dossierId: gridConstants.CompoundGrid_AttributeForms.id,
        });

        // Navigate to "3CS: All attributes" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: '3CS: All attributes' });

        // CS 1 has First Name/Last Name - grid cell at "1", "2" has text "Vivien"
        await since('The grid cell in visualization "Visualization 4" at "1", "2" has text "Vivien"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '2', 'Visualization 4'))
            .toBe('Vivien');

        // Grid cell at "2", "1" has text "Prokos"
        await since('The grid cell in visualization "Visualization 4" at "2", "1" has text "Prokos"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('2', '1', 'Visualization 4'))
            .toBe('Prokos');

        // CS 2 has DESC - grid cell at "1", "5" has text "Bantam Books"
        await since('The grid cell in visualization "Visualization 4" at "1", "5" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '5', 'Visualization 4'))
            .toBe('Bantam Books');

        // CS 3 has ID - grid cell at "1", "8" has text "101"
        await since('The grid cell in visualization "Visualization 4" at "1", "8" has text "101"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '8', 'Visualization 4'))
            .toBe('101');

        // Right click on "Supplier Contact" in Column Set 1 and open "Display Attribute Forms"
        const supplierContact1 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier Contact', 'Column Set 1');
        await editorPanelForGrid.rightClick({ elem: supplierContact1 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "Contact First Name" is selected
        await since('Display form "Contact First Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact First Name'))
            .toBe(true);

        // Verify Display form "Contact Last Name" is selected
        await since('Display form "Contact Last Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact Last Name'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" in Column Set 2 and open "Display Attribute Forms"
        const supplier2 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplier2 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" in Column Set 3 and open "Display Attribute Forms"
        const supplier3 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "ID" is selectedclickVisualization
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        // Verify Display form "DESC" is not selected
        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        // Set Display Attribute Forms to "On"
        await editorPanelForGrid.setDisplayAttributeFormNames('On');
        await editorPanelForGrid.closeFormPopup('OK');

        // should have no changes - verify again after setting to "On"
        // Right click on "Supplier Contact" in Column Set 1
        const supplierContactCheck = await vizPanelForGrid.getObjectInColumnSetDropZone(
            'Supplier Contact',
            'Column Set 1'
        );
        await editorPanelForGrid.rightClick({ elem: supplierContactCheck });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify forms are still the same
        await since('Display form "Contact First Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact First Name'))
            .toBe(true);

        await since('Display form "Contact Last Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact Last Name'))
            .toBe(true);

        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');
    });

    it('[TC169258_01] 2 metrics in CS1, attribute and metric in CS2 - context menu validation', async () => {
        // Open dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_AttributeForms.project.id,
            dossierId: gridConstants.CompoundGrid_AttributeForms.id,
        });

        // Navigate to "2CS: Metrics + Att w/ Metric" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: '2CS: Metrics + Att w/ Metric' });

        // Verify DESC is shown for supplier - grid cell at "1", "4" has text "Bantam Books"
        await since('The grid cell in visualization "Visualization 2" at "1", "4" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '4', 'Visualization 2'))
            .toBe('Bantam Books');

        // Right click on "Supplier" in Column Set 2 and open "Display Attribute Forms"
        const supplier2 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplier2 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Set Display Attribute Forms to "On"
        await editorPanelForGrid.setDisplayAttributeFormNames('On');
        await editorPanelForGrid.closeFormPopup('OK');

        // should still be the same - verify again
        const supplierCheck = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplierCheck });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');

        // DE169258: for column set with only metrics, RMC and ensure showing all context menu options
        // Right click on "Cost" and verify "Show Totals" option is displayed
        await vizPanelForGrid.rightClickOnHeader('Cost', 'Visualization 2');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Show Totals', 'Cost', 'Visualization 2')
            )
            .toBe(true);

        // Close context menu by clicking elsewhere
        await vizPanelForGrid.clickOnViz('Visualization 2');

        // Right click on "Profit" and verify "Show Totals" option is displayed
        await vizPanelForGrid.rightClickOnHeader('Profit', 'Visualization 2');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Show Totals', 'Profit', 'Visualization 2')
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 2');

        // Right click on "Revenue" and verify "Show Totals" option is displayed
        await vizPanelForGrid.rightClickOnHeader('Revenue', 'Visualization 2');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Show Totals',
                    'Revenue',
                    'Visualization 2'
                )
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 2');

        // Right click on value "$38,153" and verify "Show Data..." option is displayed
        await vizPanelForGrid.selectContextMenuOptionFromElement('$38,153', 'Show Data...', 'Visualization 2');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    });

    it('[TC169258_02] 2 metrics in CS1, Same attribute and metric in CS2 and CS3', async () => {
        // Open dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_AttributeForms.project.id,
            dossierId: gridConstants.CompoundGrid_AttributeForms.id,
        });

        // Navigate to "3CS: Metrics + Att w/ Metric" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: '3CS: Metrics + Att w/ Metric' });

        // Verify DESC is shown for supplier in CS 2 - grid cell at "1", "4" has text "Bantam Books"
        await since('The grid cell in visualization "Visualization 3" at "1", "4" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '4', 'Visualization 3'))
            .toBe('Bantam Books');

        // Verify ID is shown for supplier in CS 3 - grid cell at "1", "7" has text "101"
        await since('The grid cell in visualization "Visualization 3" at "1", "7" has text "101"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '7', 'Visualization 3'))
            .toBe('101');

        // Right click on "Supplier" in Column Set 2 and open "Display Attribute Forms"
        const supplier2 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplier2 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" in Column Set 3 and open "Display Attribute Forms"
        const supplier3 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "ID" is selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        // Verify Display form "DESC" is not selected
        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        // Set Display Attribute Forms to "On"
        await editorPanelForGrid.setDisplayAttributeFormNames('On');
        await editorPanelForGrid.closeFormPopup('OK');

        // Right click on "Supplier" in Column Set 3 again - should still be ID
        const supplier3Check = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3Check });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // should still be the same
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        // make another manipulation, switch from ID to DESC
        // Multiselect display forms: select DESC, unselect ID
        await editorPanelForGrid.multiSelectDisplayForms('DESC,ID');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // check that it's now DESC
        // Verify grid cell at "1", "7" now has text "Bantam Books" (switched from ID to DESC)
        await since('The grid cell in visualization "Visualization 3" at "1", "7" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '7', 'Visualization 3'))
            .toBe('Bantam Books');

        // Right click on "Supplier" in Column Set 3 and verify it's DESC now
        const supplier3Verify = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3Verify });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');

        // changes from above should not change with other CS
        // Right click on "Supplier" in Column Set 2
        const supplier2Check = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplier2Check });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Multiselect display forms: select ID, unselect DESC
        await editorPanelForGrid.multiSelectDisplayForms('ID,DESC');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        // check that it's now ID
        // Verify grid cell at "1", "4" now has text "101" (switched from DESC to ID)
        await since('The grid cell in visualization "Visualization 3" at "1", "4" has text "101"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '4', 'Visualization 3'))
            .toBe('101');

        // Right click on "Supplier" in Column Set 2 and verify it's ID now
        const supplier2Verify = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 2');
        await editorPanelForGrid.rightClick({ elem: supplier2Verify });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');

        // DE169258: for column set with only metrics, RMC and ensure showing all context menu options
        await vizPanelForGrid.rightClickOnHeader('Cost', 'Visualization 3');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Show Totals', 'Cost', 'Visualization 3')
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 3');

        await vizPanelForGrid.rightClickOnHeader('Profit', 'Visualization 3');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Show Totals', 'Profit', 'Visualization 3')
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 3');

        await vizPanelForGrid.rightClickOnHeader('Revenue', 'Visualization 3');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Show Totals',
                    'Revenue',
                    'Visualization 3'
                )
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 3');

        // also check for context menu of values, not just column headers
        await vizPanelForGrid.selectContextMenuOptionFromElement('$38,153', 'Show Data...', 'Visualization 3');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
    });

    it('[TC169258_03] 2 metrics in CS1 then same attribute in CS2 and CS3', async () => {
        // Open dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.CompoundGrid_AttributeForms.project.id,
            dossierId: gridConstants.CompoundGrid_AttributeForms.id,
        });

        // Navigate to "3CS: Metrics + Atts" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: '3CS: Metrics + Atts' });

        // Verify DESC is shown for supplier in CS 2 - grid cell at "1", "5" has text "Bantam Books"
        await since('The grid cell in visualization "Visualization 5" at "1", "5" has text "Bantam Books"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '5', 'Visualization 5'))
            .toBe('Bantam Books');

        // Verify ID is shown for supplier in CS 3 - grid cell at "1", "8" has text "101"
        await since('The grid cell in visualization "Visualization 5" at "1", "8" has text "101"')
            .expect(await vizPanelForGrid.getGridCellTextByPosition('1', '8', 'Visualization 5'))
            .toBe('101');

        // Right click on "Supplier" in Column Set 1 and open "Display Attribute Forms"
        const supplier1 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 1');
        await editorPanelForGrid.rightClick({ elem: supplier1 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" in Column Set 3 and open "Display Attribute Forms"
        const supplier3 = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3 });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        // Verify Display form "ID" is selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        // Verify Display form "DESC" is not selected
        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        // Set Display Attribute Forms to "Form name only"
        await editorPanelForGrid.setDisplayAttributeFormNames('Form name only');
        await editorPanelForGrid.closeFormPopup('OK');

        // Right click on "DESC" element (form name) and open "Display Attribute Forms"
        await vizPanelForGrid.selectContextMenuOptionFromElement('DESC', 'Display Attribute Forms', 'Visualization 5');

        // Verify Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Contact First Name" element and open "Display Attribute Forms"
        await vizPanelForGrid.selectContextMenuOptionFromElement(
            'Contact First Name',
            'Display Attribute Forms',
            'Visualization 5'
        );

        // Verify Display form "Contact First Name" is selected
        await since('Display form "Contact First Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact First Name'))
            .toBe(true);

        // Verify Display form "Contact Last Name" is selected
        await since('Display form "Contact Last Name" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Contact Last Name'))
            .toBe(true);

        // Verify Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        // Close the dialog
        await editorPanelForGrid.closeFormPopup('Cancel');

        // should not be affected - verify Supplier in Column Set 1 again
        const supplier1Check = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 1');
        await editorPanelForGrid.rightClick({ elem: supplier1Check });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(true);

        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');

        // Right click on "Supplier" in Column Set 3 and verify still ID
        const supplier3Check = await vizPanelForGrid.getObjectInColumnSetDropZone('Supplier', 'Column Set 3');
        await editorPanelForGrid.rightClick({ elem: supplier3Check });
        await editorPanelForGrid.click({ elem: editorPanelForGrid.getContextMenuOption('Display Attribute Forms') });

        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBe(true);

        await since('Display form "DESC" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBe(false);

        await editorPanelForGrid.closeFormPopup('Cancel');

        // DE169258: for column set with only metrics, RMC and ensure showing all context menu options
        // also check for context menu of values, not just column headers
        await vizPanelForGrid.selectContextMenuOptionFromElement('$38,153', 'Show Data...', 'Visualization 5');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await showDataDialog.closeShowDataDialog();

        // Right click on "Cost" header and verify "Show Totals" option is displayed
        await vizPanelForGrid.rightClickOnHeader('Cost', 'Visualization 5');
        await since('The "Show Totals" option is displayed in the context menu')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Show Totals', 'Cost', 'Visualization 5')
            )
            .toBe(true);

        await vizPanelForGrid.clickOnViz('Visualization 5');
    });
});
