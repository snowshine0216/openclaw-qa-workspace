import setWindowSize from '../../../config/setWindowSize.js';
import { browserWindow } from '../../../constants/index.js';
import * as gridConstants from '../../../constants/grid.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_AttributeForms.spec.js'
describe('NormalGrid_Attribute Forms', () => {
    let {
        vizPanelForGrid,
        datasetsPanel,
        dossierAuthoringPage,
        contentsPanel,
        libraryPage,
        loginPage,
        editorPanelForGrid,
        newGalleryPanel,
        moreOptions,
        ngmEditorPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    it('[TC2699] Sanity test for attribute forms in grid', async () => {
    //  When I open dossier by its ID "FFE71F2C11EAB0CB03D70080EFC5D78D"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.AttributeForm_Dashboard.id,
            projectId: gridConstants.AttributeForm_Dashboard.project.id,
        });

    //  When I open Display Attribute Forms menu for the "attribute" named "Employee" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Employee', 'attribute');
    //  Then Display form "ID" is available
        await since('Display form "ID" is available')
            .expect(await editorPanelForGrid.isDisplayFormAvailable('ID'))
            .toBeTrue();
    //  And Display form "Last Name" is available
        await since('Display form "Last Name" is available')
            .expect(await editorPanelForGrid.isDisplayFormAvailable('Last Name'))
            .toBeTrue();
    //  And Display form "First Name" is available
        await since('Display form "First Name" is available')
            .expect(await editorPanelForGrid.isDisplayFormAvailable('First Name'))
            .toBeTrue();
    //  And Display form "SSN" is available
        await since('Display form "SSN" is available')
            .expect(await editorPanelForGrid.isDisplayFormAvailable('SSN'))
            .toBeTrue();

    //  When I multiselect display forms "ID"
        await editorPanelForGrid.multiSelectDisplayForms('ID');
    //  #verity
    //  Then the grid cell in visualization "Visualization 1" at "2", "4" has text "Benner"
        await since('The grid cell at row 2, column 4 should have text "Benner"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('Benner');
    //  And the grid cell in visualization "Visualization 1" at "2", "6" has text "4"
        await since('The grid cell at row 2, column 6 should have text "4"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 6, 'Visualization 1').getText())
            .toBe('4');

    //  When I open Display Attribute Forms menu for the "attribute" named "Employee" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Employee', 'attribute');
    //  And I multiselect display forms "Last Name,First Name"
        await editorPanelForGrid.multiSelectDisplayForms('Last Name,First Name');
    //  #verify
    //  Then the grid cell in visualization "Visualization 1" at "2", "4" has text "4"
        await since('The grid cell at row 2, column 4 should have text "4"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('4');
    //  And the grid cell in visualization "Visualization 1" at "2", "6" has text "$520,737"
        await since('The grid cell at row 2, column 6 should have text "$520,737"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 6, 'Visualization 1').getText())
            .toBe('$520,737');

    //  When I right click on the grid cell "Manager" by off set "-5" and "-1" and select 'Display Attribute Forms' from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet("Manager", "Display Attribute Forms", "Visualization 1", -5, -1);
    //  And  I multiselect display forms "ID,Email,Display Address,Device"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Email,Display Address,Device');
    //  #verify
    //  Then the grid cell in visualization "Visualization 1" at "2", "4" has text "8"
        await since('The grid cell at row 2, column 4 should have text "8"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('8');
    //  And the grid cell in visualization "Visualization 1" at "2", "7" has text "B8D0B2C48D9511D4B89E00C04F33122E"
        await since('The grid cell at row 2, column 7 should have text "B8D0B2C48D9511D4B89E00C04F33122E"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 7, 'Visualization 1').getText())
            .toBe('B8D0B2C48D9511D4B89E00C04F33122E');
    //  And the grid cell in visualization "Visualization 1" at "2", "8" has text "4"
        await since('The grid cell at row 2, column 8 should have text "4"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 8, 'Visualization 1').getText())
            .toBe('4');

    //  When I right click on the grid cell "Manager" by off set "-10" and "-10" and select 'Display Attribute Forms' from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet("Manager", "Display Attribute Forms", "Visualization 1", -10, -10);
    //  And I multiselect display forms "ID,First Name,Email,Display Address,Device"
        await editorPanelForGrid.multiSelectDisplayForms('ID,First Name,Email,Display Address,Device');
    //  #verify
    //  Then the grid cell in visualization "Visualization 1" at "2", "2" has text "Rosie"
        await since('The grid cell at row 2, column 2 should have text "Rosie"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Rosie');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "4"
        await since('The grid cell at row 2, column 3 should have text "4"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('4');
    //  And the grid cell in visualization "Visualization 1" at "2", "4" has text "$441,073"
        await since('The grid cell at row 2, column 4 should have text "$441,073"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$441,073');

    //  When I right click on element "Manager" and select "Remove" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCellsByOffSet("Manager", "Remove", "Visualization 1", -10, -10);
    //  And I add "attribute" named "Region" from dataset "New Dataset 1" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Region', 'attribute', 'New Dataset 1');
    //  And I add "attribute" named "Manager" from dataset "New Dataset 1" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Manager', 'attribute', 'New Dataset 1');

    //  #verify
    //  Then the grid cell in visualization "Visualization 1" at "2", "4" has text "Rosie"
        await since('The grid cell at row 2, column 4 should have text "Rosie"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('Rosie');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Southeast"
        await since('The grid cell at row 2, column 3 should have text "Southeast"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Southeast');
    //  And the grid cell in visualization "Visualization 1" at "2", "5" has text "$441,073"
        await since('The grid cell at row 2, column 5 should have text "$441,073"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$441,073');

    //  When I right click on element "Employee" and select "Display Attribute Forms" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Manager", "Display Attribute Forms", "Visualization 1");
    //  And I set Display Attribute Forms "On"
        await editorPanelForGrid.setDisplayAttributeFormNames("On", true);
        await browser.pause(1000);
    //  #verify
    //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Call Center DESC"
        await since('The grid cell at row 1, column 1 should have text "Call Center DESC"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Call Center DESC');
    //  And the grid cell in visualization "Visualization 1" at "1", "2" has text "Employee ID"
        await since('The grid cell at row 1, column 2 should have text "Employee ID"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Employee ID');
    //  And the grid cell in visualization "Visualization 1" at "1", "3" has text "Region DESC"
        await since('The grid cell at row 1, column 3 should have text "Region DESC"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Region DESC');
    //  And the grid cell in visualization "Visualization 1" at "1", "4" has text "Manager Last Name"
        await since('The grid cell at row 1, column 4 should have text "Manager Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1').getText())
            .toBe('Manager Last Name');
    //  And the grid cell in visualization "Visualization 1" at "1", "5" has text "Cost"
        await since('The grid cell at row 1, column 5 should have text "Cost"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 5, 'Visualization 1').getText())
            .toBe('Cost');
    //  And the grid cell in visualization "Visualization 1" at "1", "6" has text "Revenue"
        await since('The grid cell at row 1, column 6 should have text "Revenue"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 6, 'Visualization 1').getText())
            .toBe('Revenue');

    //  #When I click on insert new visualization
    //  When I insert "Grid" from toolbar
        await dossierAuthoringPage.actionOnToolbar("Visualization");
        await newGalleryPanel.selectViz("Grid")
    //  When I add "attribute" named "Manager" from dataset "New Dataset 1" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Manager', 'attribute', 'New Dataset 1');
    //  When I add "attribute" named "Employee" from dataset "New Dataset 1" to the current Viz by double click
        await datasetsPanel.addObjectToVizByDoubleClick('Employee', 'attribute', 'New Dataset 1');

    //  #verify
    //  Then the grid cell in visualization "Visualization 2" at "2", "1" has text "Aoter"
        await since('The grid cell at row 2, column 1 should have text "Aoter"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 2').getText())
            .toBe('Aoter');
    //  And the grid cell in visualization "Visualization 2" at "2", "2" has text "Barbara"
        await since('The grid cell at row 2, column 2 should have text "Barbara"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 2').getText())
            .toBe('Barbara');
    //  And the grid cell in visualization "Visualization 2" at "2", "3" has text "De Le Torre"
        await since('The grid cell at row 2, column 3 should have text "De Le Torre"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 2').getText())
            .toBe('De Le Torre');
    //  And the grid cell in visualization "Visualization 2" at "2", "4" has text "Sandra"
        await since('The grid cell at row 2, column 4 should have text "Sandra')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 2').getText())
            .toBe('Sandra');
    //  And the grid cell in visualization "Visualization 2" at "1", "1" has text "Manager"
        await since('The grid cell at row 1, column 1 should have text "Manager"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 2').getText())
            .toBe('Manager');
    //  And the grid cell in visualization "Visualization 2" at "1", "2" has text "Employee"
        await since('The grid cell at row 1, column 2 should have text "Employee"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 2').getText())
            .toBe('Employee');

    //  When I open the More Options dialog for the visualization "Visualization 2" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 2');
        await vizPanelForGrid.selectContextMenuOption('More Options...');
    //  Then Current Attribute Display Form Mode is set to "Off"
        await since('Current Attribute Display Form Mode is set to "Off"')
            .expect(await moreOptions.getCurrentAttributeDisplayFormMode().getValue())
            .toBe('Off');
    //  When I select "On" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode("On");
    //  And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
    //  #verify
    //  Then the grid cell in visualization "Visualization 2" at "1", "1" has text "Manager Last Name"
        await since('The grid cell at row 1, column 1 should have text "Manager Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 2').getText())
            .toBe('Manager Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "2" has text "Manager First Name"
        await since('The grid cell at row 1, column 2 should have text "Manager First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 2').getText())
            .toBe('Manager First Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "3" has text "Employee Last Name"
        await since('The grid cell at row 1, column 3 should have text "Employee Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 2').getText())
            .toBe('Employee Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "4" has text "Employee First Name"
        await since('The grid cell at row 1, column 4 should have text "Employee First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('Employee First Name');

    //  When I open the More Options dialog for the visualization "Visualization 2" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 2');
        await vizPanelForGrid.selectContextMenuOption('More Options...');
    //  Then Current Attribute Display Form Mode is set to "On"
        await since('Current Attribute Display Form Mode is set to "On"')
            .expect(await moreOptions.getCurrentAttributeDisplayFormMode().getValue())
            .toBe('On');
    //  When I select "Form name only" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode("Form name only");
    //  And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
    //  #verify
    //  Then the grid cell in visualization "Visualization 2" at "1", "1" has text "Last Name"
        await since('The grid cell at row 1, column 1 should have text "Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 2').getText())
            .toBe('Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "2" has text "First Name"
        await since('The grid cell at row 1, column 2 should have text "First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 2').getText())
            .toBe('First Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "3" has text "Last Name"
        await since('The grid cell at row 1, column 3 should have text "Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 2').getText())
            .toBe('Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "4" has text "First Name"
        await since('The grid cell at row 1, column 4 should have text "First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('First Name');

    //  When I open the More Options dialog for the visualization "Visualization 2" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 2');
        await vizPanelForGrid.selectContextMenuOption('More Options...');
    //  Then Current Attribute Display Form Mode is set to "Form name only"
        await since('Current Attribute Display Form Mode is set to "Form name only"')
            .expect(await moreOptions.getCurrentAttributeDisplayFormMode().getValue())
            .toBe('Form name only');
    //  When I select "Show attribute name once" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode("Show attribute name once");
    //  And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
    //  #verify
    //  Then the grid cell in visualization "Visualization 2" at "1", "1" has text "Manager Last Name"
        await since('The grid cell at row 1, column 1 should have text "Manager Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 2').getText())
            .toBe('Manager Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "2" has text "First Name"
        await since('The grid cell at row 1, column 2 should have text "First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 2').getText())
            .toBe('First Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "3" has text "Employee Last Name"
        await since('The grid cell at row 1, column 3 should have text "Employee Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 2').getText())
            .toBe('Employee Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "4" has text "First Name"
        await since('The grid cell at row 1, column 4 should have text "First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('First Name');

    //  When I open the More Options dialog for the visualization "Visualization 2" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 2');
        await vizPanelForGrid.selectContextMenuOption('More Options...');
    //  Then Current Attribute Display Form Mode is set to "Show attribute name once"
        await since('Current Attribute Display Form Mode is set to "Show attribute name once"')
            .expect(await moreOptions.getCurrentAttributeDisplayFormMode().getValue())
            .toBe('Show attribute name once');
    //  When I select "Automatic" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode("Automatic");
    //  And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
    //  #verify
    //  Then the grid cell in visualization "Visualization 2" at "1", "1" has text "Manager Last Name"
        await since('The grid cell at row 1, column 1 should have text "Manager Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 2').getText())
            .toBe('Manager Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "2" has text "Manager First Name"
        await since('The grid cell at row 1, column 2 should have text "Manager First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 2').getText())
            .toBe('Manager First Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "3" has text "Employee Last Name"
        await since('The grid cell at row 1, column 3 should have text "Employee Last Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 2').getText())
            .toBe('Employee Last Name');
    //  And the grid cell in visualization "Visualization 2" at "1", "4" has text "Employee First Name"
        await since('The grid cell at row 1, column 4 should have text "Employee First Name"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 2').getText())
            .toBe('Employee First Name');
    });

    it('[TC80521_01] Subtotals for a grid with attribute forms: attributes in rows simple grid', async () => {
    //  When I open dossier by its ID "3E2DA873F34F8DCF0904688231D70498"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_AttributeForms_TC19943.id,
            projectId: gridConstants.Subtotals_AttributeForms_TC19943.project.id,
        });

    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Books"
        await since('The grid cell at row 2, column 1 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Books');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Mid-Atlantic"
        await since('The grid cell at row 2, column 3 should have text "Mid-Atlantic"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
    //  And the grid cell in visualization "Visualization 1" at "2", "5" has text "$47,780"
        await since('The grid cell at row 2, column 5 should have text "$47,780"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$47,780');

    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeFalse();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  #this pause is to reduce the occurence of stale element refernce error
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is not selected
        await since('Display form "Image" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeFalse();
    //  #enable forms
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "2", "2" has text "1"
        await since('The grid cell at row 2, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "2", "7" has text "$47,780"
        await since('The grid cell at row 2, column 7 should have text "$47,780"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 7, 'Visualization 1').getText())
            .toBe('$47,780');
    //  #enable subtotals
    //  When I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Total"
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "2", "5" has text "$15,130,823"
        await since('The grid cell at row 2, column 5 should have text "$15,130,823"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$15,130,823');
    //  And the grid cell in visualization "Visualization 1" at "4", "5" has text "Total"
        await since('The grid cell at row 4, column 5 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 5, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "4", "6" has text "$177,624"
        await since('The grid cell at row 4, column 6 should have text "$177,624"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 6, 'Visualization 1').getText())
            .toBe('$177,624');

    //  #move from left
    //  When I right click on element "1" and select "Move Left" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("1", "Move Left", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "3", "1" has text "1"
        await since('The grid cell at row 3, column 1 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "3", "2" has text "Books"
        await since('The grid cell at row 3, column 2 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Books');
    //  And the grid cell in visualization "Visualization 1" at "2", "5" has text "$15,130,823"
        await since('The grid cell at row 2, column 5 should have text "$15,130,823"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$15,130,823');
    //  #move subtotal to bottom
    //  When I right click on element "Total" and select "Move to bottom" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to bottom", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "1"
        await since('The grid cell at row 2, column 1 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "7", "5" has text "Total"
        await since('The grid cell at row 7, column 5 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(7, 5, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "2", "7" has text "$47,780"
        await since('The grid cell at row 2, column 7 should have text "$47,780"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 7, 'Visualization 1').getText())
            .toBe('$47,780');
    //  And the grid cell in visualization "Visualization 1" at "2", "2" has text "Books"
        await since('The grid cell at row 2, column 2 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Books');
    //  #move subtotal to top
    //  When I right click on element "Total" and select "Move to top" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to top", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Total"
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "7" has text "$47,780"
        await since('The grid cell at row 5, column 7 should have text "$47,780"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$47,780');
    //  And the grid cell in visualization "Visualization 1" at "3", "2" has text "Books"
        await since('The grid cell at row 3, column 2 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Books');
    //  #deselect forms
    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeTrue();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  #this pause is to reduce the occurence of stale element refernce error
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is selected
        await since('Display form "Image" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeTrue();
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "3", "2" has text "Total"
        await since('The grid cell at row 3, column 2 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "5" has text "$47,780"
        await since('The grid cell at row 5, column 5 should have text "$47,780"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 5, 'Visualization 1').getText())
            .toBe('$47,780');
    });

    it('[TC80521_02] Subtotals for a grid with attribute forms: xtab compound grid', async () => {
    //  When I open dossier by its ID "3E2DA873F34F8DCF0904688231D70498"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_AttributeForms_TC19943.id,
            projectId: gridConstants.Subtotals_AttributeForms_TC19943.project.id,
        });
    //  Then The Dossier Editor is displayed

    //  When I switch to page "Attr in Rows" in chapter "Compound" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Compound', pageName: 'Attr in Rows' });
    //  Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Books"
        await since('The grid cell at row 4, column 1 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Books');
    //  And the grid cell in visualization "Visualization 1" at "4", "4" has text "$35,750"
        await since('The grid cell at row 4, column 4 should have text "$35,750"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 4, 'Visualization 1').getText())
            .toBe('$35,750');
    //  #enable attribute forms
    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  And Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeFalse();
    //  #this pause is to reduce the occurence of stale element reference error
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is not selected
        await since('Display form "Image" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeFalse();
        
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "4", "2" has text "1"
        await since('The grid cell at row 4, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "4", "5" has text "Mid-Atlantic"
        await since('The grid cell at row 4, column 5 should have text "Mid-Atlantic"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 5, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
    //  #move from right
    //  When I right click on element "Books" and select "Move Right" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Books", "Move Right", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "4", "1" has text "1"
        await since('The grid cell at row 4, column 1 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('1');
    //  Then the grid cell in visualization "Visualization 1" at "4", "2" has text "Books"
        await since('The grid cell at row 4, column 2 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Books');
    //  And the grid cell in visualization "Visualization 1" at "4", "4" has text "Art & Architecture"
        await since('The grid cell at row 4, column 4 should have text "Art & Architecture"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 4, 'Visualization 1').getText())
            .toBe('Art & Architecture');
    //  #enable subtotal
    //  When I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Total"
        await since('The grid cell at row 4, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "4", "5" has text "$15,130,823"
        await since('The grid cell at row 4, column 5 should have text "$15,130,823"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 5, 'Visualization 1').getText())
            .toBe('$15,130,823');
    //  And the grid cell in visualization "Visualization 1" at "6", "5" has text "Total"
        await since('The grid cell at row 6, column 5 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 5, 'Visualization 1').getText())
            .toBe('Total');

    //  #change display form to on
    //  When I open the More Options dialog for the visualization "Visualization 1" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('More Options...');
    //  When I select "On" from display attribute form mode pull down list in More Options dialog
        await moreOptions.selectDisplayAttributeFormMode("On");
    //  And I save and close More Options dialog
        await moreOptions.saveAndCloseMoreOptionsDialog();
    //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Category ID"
        await since('The grid cell at row 1, column 1 should have text "Category ID"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category ID');
    //  Then the grid cell in visualization "Visualization 1" at "1", "2" has text "Category DESC"
        await since('The grid cell at row 1, column 2 should have text "Category DESC"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Category DESC');
    //  And the grid cell in visualization "Visualization 1" at "1", "3" has text "Category Image"
        await since('The grid cell at row 1, column 3 should have text "Category Image"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Category Image');

    //  #move move to left with subtotal
    //  When I right click on element "Books" and select "Move Left" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Books", "Move Left", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "Books"
        await since('The grid cell at row 5, column 1 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
    //  Then the grid cell in visualization "Visualization 1" at "5", "2" has text "1"
        await since('The grid cell at row 5, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "1", "1" has text "Category DESC"
        await since('The grid cell at row 1, column 1 should have text "Category DESC"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category DESC');

    //  #move subtotal to bottom
    //  When I right click on element "Total" and select "Move to bottom" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to bottom", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "4", "1" has text "Books"
        await since('The grid cell at row 4, column 1 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Books');
    //  Then the grid cell in visualization "Visualization 1" at "4", "2" has text "1"
        await since('The grid cell at row 4, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "4", "4" has text "Art & Architecture"
        await since('The grid cell at row 4, column 4 should have text "Art & Architecture"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 4, 'Visualization 1').getText())
            .toBe('Art & Architecture');

    //  #move subtotal to top
    //  When I right click on element "Total" and select "Move to top" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to top", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "Books"
        await since('The grid cell at row 5, column 1 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
    //  Then the grid cell in visualization "Visualization 1" at "5", "2" has text "1"
        await since('The grid cell at row 5, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "1", "1" has text "Category DESC"
        await since('The grid cell at row 1, column 1 should have text "Category DESC"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Category DESC');
    });

    it('[TC19943] Subtotals for a grid with attribute forms: attributes in rows and column, xtab', async () => {
    //  When I open dossier by its ID "3E2DA873F34F8DCF0904688231D70498"
        await libraryPage.editDossierByUrl({
            dossierId: gridConstants.Subtotals_AttributeForms_TC19943.id,
            projectId: gridConstants.Subtotals_AttributeForms_TC19943.project.id,
        });

    //  # 1. Grid with metrics in rows and attributes in columns
    //  When I switch to page "Metrics in Rows" in chapter "Simple" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Simple', pageName: 'Metrics in Rows' });
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Region"
        await since('The grid cell at row 2, column 1 should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Northeast"
        await since('The grid cell at row 2, column 3 should have text "Northeast"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Northeast');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "$234,813"
        await since('The grid cell at row 3, column 5 should have text "$234,813"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$234,813');

    //  #enable forms
    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeFalse();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is not selected
        await since('Display form "Image" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeFalse();
    //  #enable forms
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "2", "2" has text "1"
        await since('The grid cell at row 2, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "5", "2" has text "$197,235"
        await since('The grid cell at row 5, column 2 should have text "$197,235"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$197,235');

    //  #enable subtotals
    //  When I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "4", "7" has text "Total"
        await since('The grid cell at row 4, column 7 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 7, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "7" has text "$980,741"
        await since('The grid cell at row 5, column 7 should have text "$980,741"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$980,741');
    //  And the grid cell in visualization "Visualization 1" at "4", "13" has text "Total"
        await since('The grid cell at row 4, column 13 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 13, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "13" has text "$9,475,670"
        await since('The grid cell at row 5, column 13 should have text "$9,475,670"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 13, 'Visualization 1').getText())
            .toBe('$9,475,670');

    //  #move from left
    //  When I right click on element "1" and select "Move Left" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("1", "Move Left", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "1", "2" has text "1"
        await since('The grid cell at row 1, column 2 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "5", "2" has text "$197,235"
        await since('The grid cell at row 5, column 2 should have text "$197,235"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$197,235');
    //  And the grid cell in visualization "Visualization 1" at "4", "2" has text "Mid-Atlantic"
        await since('The grid cell at row 4, column 2 should have text "Mid-Atlantic"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
    //  #move subtotal to left
    //  When I right click on element "Total" and select "Move to left" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to left", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Total"
        await since('The grid cell at row 2, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "2" has text "$15,130,823"
        await since('The grid cell at row 6, column 2 should have text "$15,130,823"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('$15,130,823');
    //  And the grid cell in visualization "Visualization 1" at "6", "3" has text "$1,289,155"
        await since('The grid cell at row 6, column 3 should have text "$1,289,155"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$1,289,155');
    //  #move subtotal to right
    //  When I right click on element "Total" and select "Move to right" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to right", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "4", "7" has text "Total"
        await since('The grid cell at row 4, column 7 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 7, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "7" has text "$980,741"
        await since('The grid cell at row 5, column 7 should have text "$980,741"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$980,741');
    //  And the grid cell in visualization "Visualization 1" at "4", "13" has text "Total"
        await since('The grid cell at row 4, column 13 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 13, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "5", "13" has text "$9,475,670"
        await since('The grid cell at row 5, column 13 should have text "$9,475,670"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 13, 'Visualization 1').getText())
            .toBe('$9,475,670');
    //  #enable subtotals (avg, max) for attribute
    //  When I enable subtotals "Average,Maximum" of "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Category', 'attribute', 'Average,Maximum');
    //  Then the grid cell in visualization "Visualization 1" at "4", "20" has text "Total"
        await since('The grid cell at row 4, column 20 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 20, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "4", "21" has text "Average"
        await since('The grid cell at row 4, column 21 should have text "Average"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 21, 'Visualization 1').getText())
            .toBe('Average');
    //  And the grid cell in visualization "Visualization 1" at "4", "22" has text "Maximum"
        await since('The grid cell at row 4, column 22 should have text "Maximum"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 22, 'Visualization 1').getText())
            .toBe('Maximum');
    //  And the grid cell in visualization "Visualization 1" at "5", "20" has text "$12,269,714"
        await since('The grid cell at row 5, column 20 should have text "$12,269,714"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 20, 'Visualization 1').getText())
            .toBe('$12,269,714');
    //  And the grid cell in visualization "Visualization 1" at "5", "21" has text "$817,981"
        await since('The grid cell at row 5, column 21 should have text "$817,981"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 21, 'Visualization 1').getText())
            .toBe('$817,981');
    //  And the grid cell in visualization "Visualization 1" at "5", "22" has text "$3,614,648"
        await since('The grid cell at row 5, column 22 should have text "$3,614,648"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 22, 'Visualization 1').getText())
            .toBe('$3,614,648');
    //  #hide total from editor panel
    //  When I toggle totals from editor panel
	    await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "4", "7" has text "Mid-Atlantic"
        await since('The grid cell at row 4, column 7 should have text "Mid-Atlantic"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 7, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
    //  And the grid cell in visualization "Visualization 1" at "5", "7" has text "$1,905,863"
        await since('The grid cell at row 5, column 7 should have text "$1,905,863"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1').getText())
            .toBe('$1,905,863');
    //  #enable subtotal from viz context menu
    //  When I toggle the Show Totals for the visualization "Visualization 1" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Visualization 1" at "4", "20" has text "Total"
        await since('The grid cell at row 4, column 20 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 20, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "4", "21" has text "Average"
        await since('The grid cell at row 4, column 21 should have text "Average"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 21, 'Visualization 1').getText())
            .toBe('Average');
    //  And the grid cell in visualization "Visualization 1" at "4", "22" has text "Maximum"
        await since('The grid cell at row 4, column 22 should have text "Maximum"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 22, 'Visualization 1').getText())
            .toBe('Maximum');
    //  And the grid cell in visualization "Visualization 1" at "5", "20" has text "$12,269,714"
        await since('The grid cell at row 5, column 20 should have text "$12,269,714"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 20, 'Visualization 1').getText())
            .toBe('$12,269,714');
    //  And the grid cell in visualization "Visualization 1" at "5", "21" has text "$817,981"
        await since('The grid cell at row 5, column 21 should have text "$817,981"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 21, 'Visualization 1').getText())
            .toBe('$817,981');
    //  And the grid cell in visualization "Visualization 1" at "5", "22" has text "$3,614,648"
        await since('The grid cell at row 5, column 22 should have text "$3,614,648"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 22, 'Visualization 1').getText())
            .toBe('$3,614,648');
    //  #deselect forms
    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeTrue();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is selected
        await since('Display form "Image" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeTrue();
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "Region"
        await since('The grid cell at row 2, column 1 should have text "Region"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Region');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Northeast"
        await since('The grid cell at row 2, column 3 should have text "Northeast"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Northeast');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "$234,813"
        await since('The grid cell at row 3, column 5 should have text "$234,813"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$234,813');

    //  # 2. xTab grid
    //  When I open dossier by its ID "3E2DA873F34F8DCF0904688231D70498"
        await libraryPage.editDossierByUrl({
                dossierId: gridConstants.Subtotals_AttributeForms_TC19943.id,
                projectId: gridConstants.Subtotals_AttributeForms_TC19943.project.id,
            });
    //  Then The Dossier Editor is displayed
    //  When I switch to page "xTab" in chapter "Simple" from contents panel
        await contentsPanel.goToPage({ chapterName: 'Simple', pageName: 'xTab' });
    //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Percent Growth"
        await since('The grid cell at row 2, column 3 should have text "Percent Growth"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Percent Growth');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "Boston"
        await since('The grid cell at row 3, column 5 should have text "Boston"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('Boston');

    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is not selected
        await since('Display form "ID" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeFalse();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is not selected
        await since('Display form "Image" is not selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeFalse();
    //  #enable forms
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "2", "1" has text "1"
        await since('The grid cell at row 2, column 1 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "5", "2" has text "January"
        await since('The grid cell at row 5, column 2 should have text "January"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('January');
    //  #enable subtotals
    //  When I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "Total"
        await since('The grid cell at row 5, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "2" has text "Total"
        await since('The grid cell at row 6, column 2 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "5" has text "29.46%"
        await since('The grid cell at row 6, column 5 should have text "29.46%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 5, 'Visualization 1').getText())
            .toBe('29.46%');
    //  And the grid cell in visualization "Visualization 1" at "6", "6" has text "28.81%"
        await since('The grid cell at row 6, column 6 should have text "28.81%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 6, 'Visualization 1').getText())
            .toBe('28.81%');
    //  #move from left
    //  When I right click on element "1" and select "Move Left" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("1", "Move Left", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "1", "5" has text "1"
        await since('The grid cell at row 1, column 5 should have text "1"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 5, 'Visualization 1').getText())
            .toBe('1');
    //  And the grid cell in visualization "Visualization 1" at "10", "4" has text "Cecelia"
        await since('The grid cell at row 10, column 4 should have text "Cecelia"')
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 4, 'Visualization 1').getText())
            .toBe('Cecelia');
    //  #move subtotal to bottom
    //  When I right click on element "Total" and select "Move to bottom" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to bottom", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "2015"
        await since('The grid cell at row 5, column 1 should have text "2015"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('2015');
    //  And the grid cell in visualization "Visualization 1" at "6", "5" has text "Total"
        await since('The grid cell at row 6, column 5 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 5, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "6" has text "56.03%"
        await since('The grid cell at row 6, column 6 should have text "56.03%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 6, 'Visualization 1').getText())
            .toBe('56.03%');
    //  #move subtotal to top
    //  When I right click on element "Total" and select "Move to top" from visualization "Visualization 1"
        await vizPanelForGrid.openContextMenuItemForGridCells("Total", "Move to top", "Visualization 1");
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "Total"
        await since('The grid cell at row 5, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "2" has text "Total"
        await since('The grid cell at row 6, column 2 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "5" has text "29.46%"
        await since('The grid cell at row 6, column 5 should have text "29.46%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 5, 'Visualization 1').getText())
            .toBe('29.46%');
    //  And the grid cell in visualization "Visualization 1" at "6", "6" has text "28.81%"
        await since('The grid cell at row 6, column 6 should have text "28.81%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 6, 'Visualization 1').getText())
            .toBe('28.81%');
    //  #enable subtotals for attribute
    //  When I enable subtotals "Total,Average" of "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.createSubtotalsFromEditorPanel('Category', 'attribute', 'Total,Average');
    //  Then the grid cell in visualization "Visualization 1" at "3", "4" has text "Total"
        await since('The grid cell at row 3, column 4 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "Average"
        await since('The grid cell at row 3, column 5 should have text "Average"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('Average');
    //  And the grid cell in visualization "Visualization 1" at "5", "8" has text "22.73%"
        await since('The grid cell at row 5, column 8 should have text "22.73%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 8, 'Visualization 1').getText())
            .toBe('22.73%');
    //  And the grid cell in visualization "Visualization 1" at "9", "10" has text "50.74%"
        await since('The grid cell at row 9, column 10 should have text "50.74%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 10, 'Visualization 1').getText())
            .toBe('50.74%');
    //  #hide total from editor panel
    //  When I toggle totals from editor panel
        await ngmEditorPanel.editorPanelShortcutFunction('totals');
    //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Visualization 1" at "4", "3" has text "Percent Growth"
        await since('The grid cell at row 4, column 3 should have text "Percent Growth"')
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('Percent Growth');
    //  And the grid cell in visualization "Visualization 1" at "5", "5" has text "Boston"
        await since('The grid cell at row 5, column 5 should have text "Boston"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 5, 'Visualization 1').getText())
            .toBe('Boston');
    //  #enable subtotal from viz context menu
    //  When I toggle the Show Totals for the visualization "Visualization 1" through the visualization context menu
        await vizPanelForGrid.openContextMenu('Visualization 1');
        await vizPanelForGrid.selectContextMenuOption('Show Totals');
    //  Then the grid cell in visualization "Visualization 1" at "5", "1" has text "Total"
        await since('The grid cell at row 5, column 1 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "2" has text "Total"
        await since('The grid cell at row 6, column 2 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "6", "5" has text "29.46%"
        await since('The grid cell at row 6, column 5 should have text "29.46%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 5, 'Visualization 1').getText())
            .toBe('29.46%');
    //  And the grid cell in visualization "Visualization 1" at "6", "6" has text "28.81%"
        await since('The grid cell at row 6, column 6 should have text "28.81%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 6, 'Visualization 1').getText())
            .toBe('28.81%');
    //  And the grid cell in visualization "Visualization 1" at "3", "4" has text "Total"
        await since('The grid cell at row 3, column 4 should have text "Total"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('Total');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "Average"
        await since('The grid cell at row 3, column 5 should have text "Average"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('Average');
    //  And the grid cell in visualization "Visualization 1" at "5", "8" has text "22.73%"
        await since('The grid cell at row 5, column 8 should have text "22.73%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 8, 'Visualization 1').getText())
            .toBe('22.73%');
    //  And the grid cell in visualization "Visualization 1" at "9", "10" has text "50.74%"
        await since('The grid cell at row 9, column 10 should have text "50.74%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 10, 'Visualization 1').getText())
            .toBe('50.74%');
    //  #deselect forms
    //  When I open Display Attribute Forms menu for the "attribute" named "Category" in the Grid Editor Panel
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Category', 'attribute');
    //  Then Display form "ID" is selected
        await since('Display form "ID" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('ID'))
            .toBeTrue();
    //  And Display form "DESC" is selected
        await since('Display form "DESC" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('DESC'))
            .toBeTrue();
    //  When I pause execution for 1 seconds
    //  And Display form "Image" is selected
        await since('Display form "Image" is selected')
            .expect(await editorPanelForGrid.isDisplayFormSelected('Image'))
            .toBeTrue();
    //  When I multiselect display forms "ID,Image"
        await editorPanelForGrid.multiSelectDisplayForms('ID,Image');
    //  Then the grid cell in visualization "Visualization 1" at "1", "1" has text "Year"
        await since('The grid cell at row 1, column 1 should have text "Year"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
    //  And the grid cell in visualization "Visualization 1" at "2", "3" has text "Percent Growth"
        await since('The grid cell at row 2, column 3 should have text "Percent Growth"')
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Percent Growth');
    //  And the grid cell in visualization "Visualization 1" at "3", "5" has text "24.03%"
        await since('The grid cell at row 3, column 5 should have text "24.03%"')
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('24.03%');
    //  And the grid cell in visualization "Visualization 1" at "1", "5" has text "Books"
        await since('The grid cell at row 1, column 5 should have text "Books"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 5, 'Visualization 1').getText())
            .toBe('Books');
    });
    
});
