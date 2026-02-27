import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('AGGridAttributeForms_E2E', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };
    const tolerance = 3;

    let {
        loginPage,
        libraryPage,
        dossierPage,
        vizPanelForGrid,
        agGridVisualization,
        editorPanelForGrid,
        moreOptions,
        reportGridView,
        toc,
        gridAuthoring,
        reset,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    it('[TC71087] Validating enabling, moving attribute forms in AG Grid | Acceptance', async () => {
        // Dossier location: "Shared Report">"1. Test Users">"GridAutomation">"AGGrid _AttributeForm_tc71087"
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAttributeForms.project.id,
            dossierId: gridConstants.AGGridAttributeForms.id,
        });

        // Wait for the Dossier Editor to be fully loaded
        await dossierPage.waitForDossierLoading();

        // Verify initial grid state
        await since('The grid cell should show "Atlanta"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Visualization 1'))
            .toBe('Atlanta');
        await since('The grid cell should show "Ian"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('Ian');

        // Check Employee attribute forms
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Employee', 'attribute');
        await browser.pause(1000);

        const [isIDAvailable, isFirstNameSelected, isLastNameSelected, isIDSelected] = await Promise.all([
            editorPanelForGrid.isDisplayFormAvailable('ID'),
            editorPanelForGrid.isDisplayFormSelected('First Name'),
            editorPanelForGrid.isDisplayFormSelected('Last Name'),
            editorPanelForGrid.isDisplayFormSelected('ID')
        ]);
        
        await since('ID form should be available').expect(isIDAvailable).toBe(true);
        await since('First Name form should be selected').expect(isFirstNameSelected).toBe(true);
        await since('Last Name form should be selected').expect(isLastNameSelected).toBe(true);
        await since('ID form should not be selected').expect(isIDSelected).toBe(false);

        // Select ID form and wait for grid update
        await editorPanelForGrid.selectDisplayForms(['ID']);
        
        await since('The grid cell should show "4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('4');
        await since('The grid cell should show "Calvin"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('Calvin');

        // Check Manager attribute forms
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Manager', 'attribute');
        await browser.pause(1000); // You might want to replace this with better synchronization later

        // Get the form selection status in a single call
        const [
            isManagerIDSelected,
            isManagerLastNameSelected,
            isManagerFirstNameSelected,
            isManagerEmailSelected,
            isManagerDisplayAddressSelected
        ] = await Promise.all([
            editorPanelForGrid.isDisplayFormSelected('ID'),
            editorPanelForGrid.isDisplayFormSelected('Last Name'),
            editorPanelForGrid.isDisplayFormSelected('First Name'),
            editorPanelForGrid.isDisplayFormSelected('Email'),
            editorPanelForGrid.isDisplayFormSelected('Display Address')
        ]);

        // Perform assertions for each form
        await since('ID form should not be selected').expect(isManagerIDSelected).toBe(false);
        await since('Last Name form should be selected').expect(isManagerLastNameSelected).toBe(true);
        await since('First Name form should be selected').expect(isManagerFirstNameSelected).toBe(true);
        await since('Email form should not be selected').expect(isManagerEmailSelected).toBe(false);
        await since('Display Address form should not be selected').expect(isManagerDisplayAddressSelected).toBe(false);



        // Select additional forms
        await editorPanelForGrid.selectDisplayForms(['ID', 'Email', 'Display Address']);
        await since('The grid cell should show "Roe, Meredith"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 6, 'Visualization 1'))
            .toBe('Roe, Meredith');
        await since('The grid cell should show "16"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 4, 'Visualization 1'))
            .toBe('16');
        await since('The grid cell should show email')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('crosie@microstrategy-tutorial.demo');

        // Test different display attribute form modes
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await moreOptions.selectDisplayAttributeFormMode('On');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        await since('Header should show "Call Center DESC"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Call Center DESC');
        await since('Header should show "Manager Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Manager Last Name');
        await since('Header should show "Manager First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Manager First Name');
        await since('Header should show "Manager ID"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Manager ID');

        // Change to form name only mode
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await moreOptions.selectDisplayAttributeFormMode('Form name only');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        await since('Header should show "DESC"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('DESC');
        await since('Header should show "Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Last Name');
        await since('Header should show "First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('First Name');
        await since('Header should show "ID"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('ID');

        // Move ID column right
        await agGridVisualization.moveAttributeFormColumnToRightFromContextMenu(1, 4, 'Visualization 1');
        await since('Header should show "DESC"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('DESC');
        await since('Header should show "Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Last Name');
        await since('Header should show "First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('First Name');
        await since('Header should show "Email"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Email');

        // Change to show attribute name once mode
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await moreOptions.selectDisplayAttributeFormMode('Show attribute name once');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        await since('Header should show "Call Center DESC"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Call Center DESC');
        await since('Header should show "Manager Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Manager Last Name');
        await since('Header should show "First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('First Name');
        await since('Header should show "Email"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Email');

        // Change to automatic mode
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await moreOptions.selectDisplayAttributeFormMode('Automatic');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        await since('Header should show "Call Center"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Call Center');
        await since('Header should show "Manager Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Manager Last Name');
        await since('Header should show "Employee First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 8, 'Visualization 1'))
            .toBe('Employee First Name');
        await since('Header should show "Employee ID"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 9, 'Visualization 1'))
            .toBe('Employee ID');

        // Move Employee First Name column left
        await agGridVisualization.moveAttributeFormColumnToLeftFromContextMenu(1, 8, 'Visualization 1');
        await since('Header should show "Employee First Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 7, 'Visualization 1'))
            .toBe('Employee First Name');
        await since('Header should show "Employee Last Name"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 8, 'Visualization 1'))
            .toBe('Employee Last Name');
        await since('Header should show "Employee ID"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 9, 'Visualization 1'))
            .toBe('Employee ID');
    });

    it('[TC71087_02] BCIN-3790 attributes containing HTML tags in AG Grid', async () => {
        // Open dashboard by id: 6827C1BBAB49D357F9E344997A16EF29
        // New MicroStrategy Tutorials > Shared Reports > Automation Objects > AG Grid >"BCIN-3790"
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_AttributeHtmlTag.project.id,
            dossierId: gridConstants.AGGrid_AttributeHtmlTag.id,
        });

        await dossierPage.waitForDossierLoading();
        // take screenshot for consumption mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'TC71087_02_1',
            'Normal Grid with attribute containing HTML tags in consumption mode'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Modern Grid'),
            'TC71087_02_2',
            'Modern Grid with attribute containing HTML tags in consumption mode'
        );

        // go to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        // take screenshot for edit mode
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Normal Grid'),
            'TC71087_02_3',
            'Normal Grid with attribute containing HTML tags in edit mode'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Modern Grid'),
            'TC71087_02_4',
            'Modern Grid with attribute containing HTML tags in edit mode'
        );
    });

    it('[BCIN-5725] Can not resize/pin/freeze/hide individual form column', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "AGGrid_AttributeForms_Manipulation"
        // Dossier id: 4829CFDC3D4759AA346EFD9BBD921649
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAttributeFormsManipulation.project.id,
            dossierId: gridConstants.AGGridAttributeFormsManipulation.id,
        });
        await dossierPage.waitForDossierLoading();
        // When I resize column 3 in ag-grid visualization "Visualization 1" 100 pixels to the "right"
        const columnWidth = await agGridVisualization.getGridCellStyleByPos(0, 2, 'width');
        const columnWidthInt = parseInt(columnWidth);
        await reportGridView.resizeColumnByMovingBorder('2', 100, 'right');
        const columnWidthNew = await agGridVisualization.getGridCellStyleByPos(0, 2, 'width');
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

        // Pin column 3
        await agGridVisualization.openContextMenuItemForCellAtPosition(0, 1, 'Pin Column', 'Visualization 1');
        await agGridVisualization.clickOnSecondaryContextMenu('to the Left');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_1',
            'After pin City to left'
        );

        // Unpin column 3
        await agGridVisualization.openContextMenuItemForCellAtPosition(0, 0, 'Unpin All Columns', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_2',
            'After unpin all columns'
        );

        // Freeze up to column 3
        await agGridVisualization.openContextMenuItemForCellAtPosition(0, 1, 'Freeze Up to This Column', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_3',
            'After freeze up to City'
        );

        // Unfreeze all columns
        await agGridVisualization.openContextMenuItemForCellAtPosition(0, 1, 'Unfreeze All Columns', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_4',
            'After unfreeze all columns'
        );

        // Hide column 3
        await agGridVisualization.openContextMenuItemForCellAtPosition(0, 1, 'Hide Column', 'Visualization 1');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_5',
            'After hide City'
        );

        // Show column 3
        await agGridVisualization.openContextMenuItemForHeader(
            'Item Category',
            'Unhide All Columns',
            'Visualization 1',
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5725_6',
            'After show City'
        );
    });

    it('[BCIN-6529] Hide move left/right menu for column header with multiple attribute form and set names off', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "AGGrid_AttributeForms_Manipulation"
        // Dossier id: 4829CFDC3D4759AA346EFD9BBD921649
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAttributeFormsManipulation.project.id,
            dossierId: gridConstants.AGGridAttributeFormsManipulation.id,
        });
        await dossierPage.waitForDossierLoading();
        // RMC on the 2nd form attribute column header
        await agGridVisualization.openRMCMenuForCellAtPosition(1, 2, 'Visualization 1');
        // take screenshot of context menu
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'BCIN-6529_1',
            'Hide move left/right menu for column header with multiple attribute forms and set names off'
        );
        await agGridVisualization.openRMCMenuForCellAtPosition(2, 2, 'Visualization 1');
        // take screenshot of context menu
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'BCIN-6529_2',
            'Have move right menu for 1st form column value'
        );
        await agGridVisualization.openRMCMenuForCellAtPosition(2, 4, 'Visualization 1');
        // take screenshot of context menu
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'BCIN-6529_4',
            'Have move left menu for 3rd form column value after opening context menu'
        );
        await agGridVisualization.openRMCMenuForCellAtPosition(2, 3, 'Visualization 1');
        // take screenshot of context menu
        await takeScreenshotByElement(
            agGridVisualization.contextMenu,
            'BCIN-6529_3',
            'Have move left/right menu for 2nd form column value'
        );
        // Verify the 'Move Left' and 'Move Right' option in column cell context menu work well
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 3, 'Visualization 1', 'Move Left');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6529_5',
            'After moving the 2nd form attribute column to left'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 2, 'Visualization 1', 'Move Right');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6529_6',
            'After moving the 1st form attribute column to right'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 4, 'Visualization 1', 'Move Left');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6529_7',
            'After moving the 3rd form attribute column to left'
        );
    });

    it('[BCIN-6516] Cannot sort by a single form in AG grid when display attribute form names off', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "AGGrid_AttributeForms_Manipulation"
        // Dossier id: 4829CFDC3D4759AA346EFD9BBD921649
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAttributeFormsManipulation.project.id,
            dossierId: gridConstants.AGGridAttributeFormsManipulation.id,
        });
        await dossierPage.waitForDossierLoading();

        // Verify the 'Sort Ascending' and 'Sort Descending' option in column header context menu work well
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 2, 'Visualization 1', 'Sort Ascending');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6516_1',
            'After sorting the 1st form attribute column in ascending order'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(1, 2, 'Visualization 1', 'Sort Descending');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6516_2',
            'After sorting the 1st form attribute column in descending order'
        );
                await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 3, 'Visualization 1', 'Sort Ascending');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6516_3',
            'After sorting the 2nd form attribute column in ascending order'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 3, 'Visualization 1', 'Sort Descending');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6516_4',
            'After sorting the 2nd form attribute column in descending order'
        );
    });

    it('[BCIN-6532] Cannot set column width limit for a single form in AG grid when display attribute form names off', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "AGGrid_AttributeForms_Manipulation"
        // Dossier id: 4829CFDC3D4759AA346EFD9BBD921649
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridAttributeFormsManipulation.project.id,
            dossierId: gridConstants.AGGridAttributeFormsManipulation.id,
        });
        await dossierPage.waitForDossierLoading();

        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 3, 'Visualization 1','Column Width Limit');
        await agGridVisualization.setColumnLimitInputBox('max', '1in');
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6532_1',
            'After setting the max column width limit for 2nd form to 1 inch'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 3, 'Visualization 1','Column Width Limit');
        await takeScreenshotByElement(
            agGridVisualization.columnLimitEditor,
            'BCIN-6532_2',
            'Column limit editor for 2nd form after setting the max column width limit to 1 inch'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 2, 'Visualization 1','Column Width Limit');
        await takeScreenshotByElement(
            agGridVisualization.columnLimitEditor,
            'BCIN-6532_3',
            'Column limit editor for 1st form after setting the column width limit to 1 inch for 2nd form'
        );      
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 4, 'Visualization 1','Column Width Limit');
        await takeScreenshotByElement(
            agGridVisualization.columnLimitEditor,
            'BCIN-6532_4',
            'Column limit editor for 3rd form after setting the column width limit to 1 inch for 2nd form'
        );
        await agGridVisualization.openRMCMenuForCellAtPositionAndSelectFromCM(2, 2, 'Visualization 1','Column Width Limit');
        await agGridVisualization.setColumnLimitInputBox('max', '0.7in');
        await agGridVisualization.clickButtonInColumnLimitEditor('OK');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-6532_5',
            'After setting the max column width limit for 1st form to 0.7 inch'
        );
    });  

    it('[BCIN-5281] Column header should be merged for multiple form attribute', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "DE307168+DE307170"
        // Dossier id: 2CC61A4D9648E74C42E0F6B8C96F8BA3
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridMultiFormMergeColumnHeader.project.id,
            dossierId: gridConstants.AGGridMultiFormMergeColumnHeader.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DE307170' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Modern'),
            'BCIN-5281_01',
            'Column header merged for multiple form attribute'
        );
    });  

    it('[BCIN-5765] Merge cell for NDE when have multiple form attribute', async () => {
        // Dossier location: Shared Reports > Automation Objects > AG Grid > Multiple Attribute Forms > "DE307168+DE307170"
        // Dossier id: 2CC61A4D9648E74C42E0F6B8C96F8BA3
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridAttributeFormsManipulation.project.id,
            dossierId: gridConstants.AGGridAttributeFormsManipulation.id,
        });        
        await dossierPage.waitForDossierLoading();
        await reset.resetIfEnabled();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'NDE' });
        await dossierPage.waitForDossierLoading();
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5765_01',
            'Column header merged for multiple form attribute'
        );
        // Maximize the visualization and take screenshot
        await gridAuthoring.clickOnMaximizeRestoreButton('Visualization 1');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5765_02',
            'Column header merged for multiple form attribute in maximized mode'
        );
        // Restore the visualization
        await gridAuthoring.clickOnMaximizeRestoreButton('Visualization 1');
        await dossierPage.waitForDossierLoading();
        // Scroll down and take screenshot
        await agGridVisualization.scrollVertically('down', 200, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollVerticallyDownToNextSlice(2, 'Visualization 1');
        await browser.pause(1000);
        await agGridVisualization.scrollVerticallyDownToNextSlice(3, 'Visualization 1');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Visualization 1'),
            'BCIN-5765_03',
            'Column header merged for multiple form attribute after scrolling down'
        );
        // Keep only and take screenshot
        await agGridVisualization.openContextMenuItemForValue('Group 1', 'Keep Only', 'Visualization 1');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(
        await agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5765_04',
            'Keep only "Group 1" with column header merged for multiple form attribute'
        );
    });  
});
