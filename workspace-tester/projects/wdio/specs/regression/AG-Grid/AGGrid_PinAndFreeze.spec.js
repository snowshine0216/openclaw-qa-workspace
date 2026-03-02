import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Pin/Freeze in AG Grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        libraryPage,
        contentsPanel,
        editorPanel,
        agGridVisualization,
        compoundGridVisualization,
        dossierAuthoringPage,
        reportFormatPanel,
        editorPanelForGrid,
        baseContainer,
        vizPanelForGrid,
        formatPanel,
        moreOptions,
        newFormatPanelForGrid,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {});

    /**
     * Verifies the column header by its pin index.
     * @param {string} columnName - The name of the column to verify.
     * @param {string} pinArea - The pin area ('left' or 'right').
     * @param {number} pinIndex - The expected pin index of the column.
     * @param {string} visualizationName - The visualization name (e.g., 'Visualization 1').
     */
    async function verifyColumnHeaderByIndex(columnName, pinArea, pinIndex, visualizationName, isHas = true) {
        const col = await agGridVisualization.getColHeaderByPinIdx(pinIndex.toString(), pinArea, visualizationName);
        const txt = await col.getText();
        if (isHas) {
            await since(`The column "${columnName}" should have ${pinArea} pin index ${pinIndex}`)
                .expect(txt)
                .toBe(columnName);
        } else {
            await since(`The column "${columnName}" should not have ${pinArea} pin index ${pinIndex}`)
                .expect(txt)
                .not.toBe(columnName);
        }
    }

    /**
     * Verifies the pinned area indicator for a specific column.
     * @param {string} columnName - The name of the column to verify.
     * @param {string} pinArea - The pin area ('left' or 'right').
     * @param {string} visualizationName - The visualization name (e.g., 'Visualization 1').
     */
    async function verifyPinnedAreaIndicator(columnName, pinArea, visualizationName, isHas = true) {
        const isLeftPinArea = pinArea === 'left';
        const col = await agGridVisualization.getPinnedAreaIndicator(isLeftPinArea, visualizationName);
        const txt = await col.getText();

        if (isHas) {
            await since(
                `The visible indicator of ${pinArea} pin area should be on #{expected}, instead we have #{actual}`
            )
                .expect(txt)
                .toBe(columnName);
        } else {
            await since(`The visible indicator of ${pinArea} pin area should not be on "${columnName}"`)
                .expect(txt)
                .not.toBe(columnName);
        }
    }

    it('[TC94223_1] Pin columns in modern grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Step 2.1: Validate Hierarchical mode
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Normal' });

        //The container "Visualization 1" should be selected
        await agGridVisualization.clickOnContainerTitle('Visualization 1');

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        // let dropdownOption = await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Hierarchical');

        // await since('The selected option in dropdown should be "Hierarchical"')
        //     .expect(await dropdownOption.getText())
        //     .toBe('Hierarchical');
        await since('Merge repetitive cells in Row headers should be enabled, instead we have #{actual}')
            .expect(await reportFormatPanel.getCheckedCheckbox('Row headers', 'Merge repetitive cells').isDisplayed())
            .toBe(true);

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        // Step 2.2: Pin "Account Executive ID" to the left and verify
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        // dropdownOption = await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Compact');

        // await since('The selected option in dropdown should be "Compact"')
        //     .expect(await dropdownOption.getText())
        //     .toBe('Compact');
        await since('The option "Merge repetitive cells" in "Row headers" section should be unchecked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Merge repetitive cells'))
            .toBe(false);
        await since('The option "Merge repetitive cells" in "Column headers" section should be checked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Merge repetitive cells'))
            .toBe(false);

        // Step 2.3: Undo pinning
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);

        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        // Step 2.4: Redo pinning
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        // Step 2.5: Pin "Account Level ID" to the left and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Account Level ID', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Level ID', 'left', 'Visualization 1');

        // Step 3.1: Pin "Account ID" to the right and verify scrolling
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account ID',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Account ID', 'right', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account ID', 'right', 'Visualization 1');

        await agGridVisualization.scrollHorizontally('right', 1000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 500, 'Visualization 1');
        await since('The header cell "Account Executive ID" should still be present')
            .expect(
                await agGridVisualization.getGroupHeaderCell('Account Executive ID', 'Visualization 1').isDisplayed()
            )
            .toBe(true);

        // Step 3.2: Pin "Parts ($)" to the right and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Parts ($)',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Parts ($)', 'right', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account ID', 'right', 'Visualization 1');

        // Step 3.2: Scroll, pin "Total ($) Comparison by Region" to the right, and verify
        await agGridVisualization.scrollHorizontally('right', 1000, 'Visualization 1');
        await agGridVisualization.scrollHorizontally('right', 500, 'Visualization 1');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Total ($) Comparison by Region',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Total ($) Comparison by Region', 'right', 3, 'Visualization 1');

        // Step 3.3: Undo pinning
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Parts ($)', 'right', 2, 'Visualization 1');

        // Step 3.4: Redo pinning
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Total ($) Comparison by Region', 'right', 3, 'Visualization 1');

        // Step 4.1: Unpin all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account ID',
            'Unpin All Columns',
            null,
            'Visualization 1'
        );
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);

        // Step 4.2: Undo unpinning
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account ID', 'right', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Parts ($)', 'right', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Total ($) Comparison by Region', 'right', 3, 'Visualization 1');

        // Step 4.3: Redo unpinning
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await browser.pause(2000);
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);
    });

    it('[TC94223_2] Freeze columns in modern grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Step 5.1: Validate Hierarchical mode
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Normal' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        // let dropdownOption = await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Hierarchical');

        // await since('The selected option in dropdown should be "Hierarchical"')
        //     .expect(await dropdownOption.getText())
        //     .toBe('Hierarchical');
        await since('Merge repetitive cells in Row headers should be enabled, instead we have #{actual}')
            .expect(await reportFormatPanel.getCheckedCheckbox('Row headers', 'Merge repetitive cells').isDisplayed())
            .toBe(true);
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        // Step 5.2: Freeze "Account Executive ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        // dropdownOption = await baseFormatPanelReact.getPullDownWithCurrentSelectionReact('Hierarchical');

        // await since('The selected option in dropdown should be "Hierarchical"')
        //     .expect(await dropdownOption.getText())
        //     .toBe('Hierarchical');
        await since('Merge repetitive cells in Row headers should be enabled, instead we have #{actual}')
            .expect(await reportFormatPanel.getCheckedCheckbox('Row headers', 'Merge repetitive cells').isDisplayed())
            .toBe(true);
        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        // Step 5.2: Undo freezing
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        // Step 5.3: Redo freezing
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        // Step 5.4: Freeze "Account Level ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level ID',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Level ID', 'left', 'Visualization 1');

        // Step 6.1: Validate column headers unmerged
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.switchToTab('microcharts');
        await newFormatPanelForGrid.expandLayoutSection();
        await since('Merge repetitive cells in Column headers should be unchecked, instead we have #{actual}')
            .expect(
                await reportFormatPanel.getCheckedCheckbox('Column headers', 'Merge repetitive cells').isDisplayed()
            )
            .toBe(false);

        await newFormatPanelForGrid.expandSpacingSection();
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Container');

        // Step 6.1: Freeze "2020" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2020',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );

        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 11, 'Visualization 1');

        await since('The group column "2020 Q1" should be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBeTrue();

        // Step 6.2: Undo freezing
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await verifyPinnedAreaIndicator('Account Level ID', 'left', 'Visualization 1');

        // Step 6.3: Redo freezing and verify multiple columns
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await browser.pause(2000);
        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 6, 'Visualization 1');

        const frozenGroupColumns = ['2019 Q1', '2019 Q2', '2019 Q3', '2019 Q4', '2020 Q1'];
        for (const groupColumn of frozenGroupColumns) {
            await since(`The group column "${groupColumn}" should be in the frozen area`)
                .expect(
                    await agGridVisualization
                        .getGroupColHeaderCellInFrozenArea(groupColumn, 'Visualization 1')
                        .isExisting()
                )
                .toBe(true);
        }

        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');

        //undo pin group
        await dossierAuthoringPage.actionOnToolbar('Undo');
        // Step 6.4: Pause execution and freeze "Maintenance ($)"
        await browser.pause(3000); // Pause for 30 seconds
        await agGridVisualization.scrollHorizontally('right', 2500, 'Visualization 1');
        await browser.pause(3000); // Pause for 300 seconds

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Maintenance ($)',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );

        // await verifyPinnedAreaIndicator('Maintenance ($)', 'left', 'Visualization 1');

        // Step 6.5: Unfreeze all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Maintenance ($)',
            'Unfreeze All Columns',
            null,
            'Visualization 1'
        );

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The column "Account ID" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Account ID', 'Visualization 1').isExisting()
            )
            .toBeFalse();

        await since('The group column "2020 Q1" should not be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBeFalse();
    });

    it('[TC94224_1] should validate lock, pin, and freeze functionality in AG Grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Normal' });
        await agGridVisualization.clickOnContainerTitle('Visualization 1');

        // Verify no visible indicators in pin areas
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);

        // Step 2.1.2: Lock Row Headers and verify
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Lock headers');

        await since('The option "Lock headers" in "Row headers" section should be checked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Lock headers'))
            .toBe(true);

        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 6, 'Visualization 1');
        await verifyPinnedAreaIndicator('Country Longitude', 'left', 'Visualization 1');

        // Step 2.1.3: Pin "Account Executive ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        await since('The column "Account ID" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Account ID', 'Visualization 1').isExisting()
            )
            .toBe(false);

        // Verify Lock headers is unchecked
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();

        await since('The option "Lock headers" in "Row headers" section should be unchecked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Lock headers'))
            .toBe(false);

        // Step 2.1.4: Pin "Account Level ID" to the right and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level ID',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'right', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Level ID', 'right', 'Visualization 1');

        await since('The option "Unpin All Columns" should be displayed')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unpin All Columns',
                    'Account Level ID',
                    'Visualization 1'
                )
            )
            .toBe(true);

        // Step 2.1.5: Lock Row Headers again and verify
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Lock headers');

        await since('The option "Lock headers" in "Row headers" section should be checked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Lock headers'))
            .toBe(true);

        await browser.pause(2000);

        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 6, 'Visualization 1');
        await verifyPinnedAreaIndicator('Country Longitude', 'left', 'Visualization 1');

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);

        await since('The option "Unpin All Columns" should not be displayed')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unpin All Columns',
                    'Account Level ID',
                    'Visualization 1'
                )
            )
            .toBe(false);

        // Step 2.2.1: Freeze "2019 Q3" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2019 Q3',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );

        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 6, 'Visualization 1');

        const frozenGroupColumns = ['2019 Q1', '2019 Q2', '2019 Q3'];
        for (const groupColumn of frozenGroupColumns) {
            await since(`The group column "${groupColumn}" should be in the frozen area`)
                .expect(
                    await agGridVisualization
                        .getGroupColHeaderCellInFrozenArea(groupColumn, 'Visualization 1')
                        .isExisting()
                )
                .toBe(true);
        }

        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');

        // Verify Lock headers is unchecked
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();

        await since('The option "Lock headers" in "Row headers" section should be unchecked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Lock headers'))
            .toBe(false);

        // Step 2.2.2: Lock Row Headers again and verify
        await newFormatPanelForGrid.clickCheckBox('Lock headers');

        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 6, 'Visualization 1');
        //await verifyPinnedAreaIndicator('Country Longitude', 'left', 'Visualization 1');
        await browser.pause(2000);
        await since('The column "Units Sold" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Units Sold', 'Visualization 1').isDisplayed()
            )
            .toBe(false);

        // Step 2.3.1: Undo and verify frozen columns
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(1000);

        for (const groupColumn of frozenGroupColumns) {
            await since(`The group column "${groupColumn}" should be in the frozen area`)
                .expect(
                    await agGridVisualization
                        .getGroupColHeaderCellInFrozenArea(groupColumn, 'Visualization 1')
                        .isExisting()
                )
                .toBe(true);
        }

        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1', true);

        // Verify Lock headers is unchecked
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();

        await since('The option "Lock headers" in "Row headers" section should be unchecked')
            .expect(await newFormatPanelForGrid.isCheckBoxChecked('Lock headers'))
            .toBe(false);

        // Step 2.3.2: Pin "Account Executive ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        await since('The column "Account ID" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Account ID', 'Visualization 1').isDisplayed()
            )
            .toBe(false);

        // Step 2.3.3: Freeze "Account ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account ID',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');

        await since('The option "Unpin All Columns" should not be displayed')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unpin All Columns',
                    'Account ID',
                    'Visualization 1'
                )
            )
            .toBe(false);
    });

    it('[TC94224_2] should handle pinning, freezing, and attribute forms in AG Grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Switch to "Derived Attribute" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Derived Attribute' });

        // Verify the current page

        // Verify no visible indicators in pin areas
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'DA Modern Grid'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        // Step 4.2: Pin "Account DA" to the left and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA',
            'Pin Column',
            'to the Left',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account DA', 'left', 1, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Account DA', 'left', 'DA Modern Grid');

        // Step 4.3: Pin "Account DA" to the right and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA',
            'Pin Column',
            'to the Right',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account DA', 'right', 1, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Account DA', 'right', 'DA Modern Grid');

        // Step 4.4: Unpin all columns and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level',
            'Unpin All Columns',
            null,
            'DA Modern Grid'
        );
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'DA Modern Grid'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        await since('The column "Account DA" should not be in the frozen area')
            .expect(await agGridVisualization.getColHeaderCellInFrozenArea('Account DA', 'DA Modern Grid').isExisting())
            .toBe(false);

        // Step 4.5: Freeze "Account DA" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );

        await verifyColumnHeaderByIndex('Account Level', 'left', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA', 'left', 2, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Account DA', 'left', 'DA Modern Grid');

        // Step 4.6: Enable multiple forms and verify
        // Switch to editor panel
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Account DA', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('DESC,DESC 1');

        await since('The grid cell at row 2, column 2 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'DA Modern Grid'))
            .toBe('Abbot Industries');

        await since('The grid cell at row 2, column 3 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'DA Modern Grid'))
            .toBe('Zachery Whitney');

        await since('The grid cell at row 2, column 4 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'DA Modern Grid'))
            .toBe('abbot@email.com');

        // Step 4.7: Pin "Account DA" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA',
            'Pin Column',
            'to the Left',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account DA', 'left', 1, 'DA Modern Grid');

        await since('The grid cell at row 3, column 1 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'DA Modern Grid'))
            .toBe('Abbot Industries');

        await since('The grid cell at row 3, column 2 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'DA Modern Grid'))
            .toBe('Zachery Whitney');

        await since('The grid cell at row 3, column 3 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'DA Modern Grid'))
            .toBe('abbot@email.com');

        await since('The option "Freeze Up to This Column" should not be displayed')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account DA',
                    'DA Modern Grid'
                )
            )
            .toBe(false);

        // Step 4.8: Enable form display and verify
        await agGridVisualization.openMoreOptionsDialog('DA Modern Grid');
        await moreOptions.selectDisplayAttributeFormMode('On');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Step 4.10: Unpin all columns and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA ID',
            'Unpin All Columns',
            null,
            'DA Modern Grid'
        );
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'DA Modern Grid'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        await since('The column "Account DA ID" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Account DA ID', 'DA Modern Grid').isExisting()
            )
            .toBe(false);

        // Step 4.11: Freeze "Account DA DESC" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA DESC',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA ID', 'left', 2, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA DESC', 'left', 3, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Account DA DESC', 'left', 'DA Modern Grid');

        await since('The column "Account DA DESC 1" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Account DA DESC 1', 'DA Modern Grid')
                    .isExisting()
            )
            .toBe(false);

        // Step 4.12: Freeze "Account DA DESC 1" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account DA DESC 1',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account DA DESC 1', 'left', 4, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Account DA DESC 1', 'left', 'DA Modern Grid');
    });

    it('[TC94224_3] should handle pin/freeze attribute forms cases in AG Grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Switch to "Derived Attribute" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Derived Attribute' });
        await browser.pause(2000);

        // Verify no visible indicators in pin areas
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'DA Modern Grid'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        // Step 1.1: Pin "Country" to the left and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country',
            'Pin Column',
            'to the Left',
            'DA Modern Grid'
        );

        await since('The grid cell at row 3, column 1 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'DA Modern Grid'))
            .toBe('France');

        await since('The grid cell at row 3, column 4 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'DA Modern Grid'))
            .toBe('46');

        await since('The grid cell at row 3, column 5 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'DA Modern Grid'))
            .toBe('2');

        // Undo pinning
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'DA Modern Grid'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        // Step 2: Enable form display
        await agGridVisualization.openMoreOptionsDialog('DA Modern Grid');
        await moreOptions.selectDisplayAttributeFormMode('On');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        // Step 4: Pin "Country Longitude" to the left, "Country Latitude" to the right, and freeze "Country ID"
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country Longitude',
            'Pin Column',
            'to the Left',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 1, 'DA Modern Grid');
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country Latitude',
            'Pin Column',
            'to the Right',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Country Latitude', 'right', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 1, 'DA Modern Grid');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country ID',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA ID', 'left', 2, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country ID', 'left', 3, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Country ID', 'left', 'DA Modern Grid');
        await since('The column "Country Latitude" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Country Latitude', 'DA Modern Grid')
                    .isDisplayed()
            )
            .toBe(false);

        // Step 5: Freeze "Country Longitude" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country Longitude',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA ID', 'left', 2, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country ID', 'left', 3, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 4, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country Longitude', 'left', 5, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Country Longitude', 'left', 'DA Modern Grid');

        // Step 6: Hide attribute forms
        await editorPanel.switchToEditorPanel();
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Country', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('Latitude');
        await since('The grid cell at row 2, column 2 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'DA Modern Grid'))
            .toBe('Country ID');
        await since('The grid cell at row 2, column 3 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'DA Modern Grid'))
            .toBe('Country Longitude');
        await verifyPinnedAreaIndicator('Country Longitude', 'left', 'DA Modern Grid');
        await since('The group column "Q1" should not be in the frozen area')
            .expect(await agGridVisualization.getGroupColHeaderCellInFrozenArea('Q1', 'DA Modern Grid').isDisplayed())
            .toBe(false);

        // Step 7: Enable more attribute forms
        await editorPanelForGrid.openDisplayAttributeFormsMenu('Country', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('Latitude');

        await verifyColumnHeaderByIndex('Account Level ID', 'left', 1, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Account DA ID', 'left', 2, 'DA Modern Grid');
        await verifyColumnHeaderByIndex('Country ID', 'left', 3, 'DA Modern Grid');

        // Step 8: Freeze and hide attribute forms
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country Latitude',
            'Freeze Up to This Column',
            null,
            'DA Modern Grid'
        );

        await since('The grid cell at row 3, column 1 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getValueCellByPinIdx(3, 'left', 'DA Modern Grid').getText())
            .toBe('France');

        await since('The grid cell at row 3, column 2 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getValueCellByPinIdx(5, 'left', 'DA Modern Grid').getText())
            .toBe('46');

        await since('The grid cell at row 3, column 3 should have text #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getValueCellByPinIdx(4, 'left', 'DA Modern Grid').getText())
            .toBe('2');

        await since('The column "Q1" should not be in the frozen area')
            .expect(await agGridVisualization.getGroupColHeaderCellInFrozenArea('Q1', 'DA Modern Grid').isExisting())
            .toBe(false);

        await editorPanelForGrid.openDisplayAttributeFormsMenu('Country', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('Longitude');
        await verifyColumnHeaderByIndex('Country ID', 'left', 3, 'DA Modern Grid');
        await verifyPinnedAreaIndicator('Country Latitude', 'left', 'DA Modern Grid');
        await since('The grid cell at row 1， column 3 should have text "Forecast ($)"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 5, 'DA Modern Grid'))
            .toBe('Forecast ($)');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country ID',
            'Unfreeze All Columns',
            null,
            'DA Modern Grid'
        );

        await agGridVisualization.openMoreOptionsDialog('DA Modern Grid');
        await moreOptions.selectDisplayAttributeFormMode('Off');
        await agGridVisualization.saveAndCloseMoreOptionsDialog();

        await editorPanelForGrid.openDisplayAttributeFormsMenu('Country', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('Longitude');

        // Step 9: Pin and hide attribute forms
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country',
            'Pin Column',
            'to the Left',
            'DA Modern Grid'
        );
        await verifyColumnHeaderByIndex('Country', 'left', 1, 'DA Modern Grid');
        await since('The grid cell at row 3, column 1 should have text  #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'DA Modern Grid'))
            .toBe('France');

        await since('The grid cell at row 3, column 2 should have text  #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'DA Modern Grid'))
            .toBe('46');

        await since('The grid cell at row 3, column 3 should have text  #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 3, 'DA Modern Grid'))
            .toBe('2');
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);

        await editorPanelForGrid.openDisplayAttributeFormsMenu('Country', 'attribute');
        await editorPanelForGrid.multiSelectDisplayForms('Latitude');
        await since('The grid cell at row 3, column 1 should have text  #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'DA Modern Grid'))
            .toBe('France');

        await since('The grid cell at row 3, column 2 should have text  #{expected}, while it actually is #{actual}')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'DA Modern Grid'))
            .toBe('2');

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'DA Modern Grid'))
            .toBe(false);
    });

    it('[TC94224_4] should validate that pin/freeze is not supported in outline mode in AG Grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });
        // Switch to "Simple" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });

        // Step 1: No pin/freeze, then enable the outline mode
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await since('The grid cell at row 2, column 1 should have text "Abbot Industries"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 1, 'Simple'))
            .toBe('Abbot Industries');

        await since('The grid cell at row 2, column 2， should have text "Customer"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 2, 'Simple'))
            .toBe('Customer');

        // Step 2: Pin columns, then enable the outline mode
        await agGridVisualization.openContextSubMenuItemForHeader('Account', 'Pin Column', 'to the Left', 'Simple');
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level',
            'Pin Column',
            'to the Right',
            'Simple'
        );

        await verifyPinnedAreaIndicator('Account', 'left', 'Simple');
        await verifyPinnedAreaIndicator('Account Level', 'right', 'Simple');
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Simple');
        await verifyColumnHeaderByIndex('Account Level', 'right', 1, 'Simple');
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');
        await browser.pause(2000);

        await since('The grid cell at row 3, column 1 should have text "Abbot Industries"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Simple'))
            .toBe('Abbot Industries');

        await since('The grid cell at row 3, column 5 should have text "$2,078,402"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 5, 'Simple'))
            .toBe('$2,078,402');

        await since('The option "Pin Column" should not be displayed')
            .expect(await agGridVisualization.isContextMenuOptionPresentInHeaderCell('Pin Column', 'Account', 'Simple'))
            .toBe(false);

        await since('The option "Freeze Up to This Column" should not be displayed')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account',
                    'Simple'
                )
            )
            .toBe(false);

        //   await newFormatPanelForGrid.clickCheckBox('Enable Outline');

        // Step 3: Freeze columns, then enable the outline mode
        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await since('The grid cell at row 3, column 1 should have text "Abbot Industries"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Simple'))
            .toBe('Abbot Industries');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level',
            'Freeze Up to This Column',
            null,
            'Simple'
        );

        await since('The grid cell at row 1, column 0 should have text "Abbot Industries"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Simple'))
            .toBe('Abbot Industries');

        await since('The grid cell at row 4, column 2 should have text "Customer"')
            .expect(await agGridVisualization.getGridCellTextByPosition(4, 2, 'Simple'))
            .toBe('Customer');

        await verifyColumnHeaderByIndex('Account Level', 'left', 2, 'Simple');
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Simple');
        await verifyPinnedAreaIndicator('Account Level', 'left', 'Simple');

        await editorPanel.switchToEditorPanel();
        await formatPanel.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await newFormatPanelForGrid.clickCheckBox('Enable outline');

        await browser.pause(2000);

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await since('The grid cell at row 1, column 0 should have text "Abbot Industries"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Simple'))
            .toBe('Abbot Industries');
    });

    it('[TC94224_5] should handle pin/freeze conversion between normal, compound, and AG grid', async () => {
        // Open the dossier
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Switch to "Simple" page
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Simple' });

        // Verify the current pag

        // Step 1: Pin column, convert AG grid to normal grid
        await agGridVisualization.openContextSubMenuItemForHeader('Account', 'Pin Column', 'to the Left', 'Simple');
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level',
            'Pin Column',
            'to the Left',
            'Simple'
        );
        await agGridVisualization.openContextSubMenuItemForHeader('Profit', 'Pin Column', 'to the Right', 'Simple');

        await verifyPinnedAreaIndicator('Account Level', 'left', 'Simple');
        await verifyPinnedAreaIndicator('Profit', 'right', 'Simple');
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Simple');
        await verifyColumnHeaderByIndex('Account Level', 'left', 2, 'Simple');
        await verifyColumnHeaderByIndex('Profit', 'right', 1, 'Simple');

        await baseContainer.changeViz('Grid', 'Simple', true);

        await since('The classic grid cell at row 1, column 1 should have text "Account"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Simple').getText())
            .toBe('Account');

        await since('The classic grid cell at row 1, column 2 should have text "Account Level"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Simple').getText())
            .toBe('Account Level');

        await since('The classic grid cell at row 1, column 3 should have text "Account Executive"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Simple').getText())
            .toBe('Account Executive');

        await since('The context menu should not contain "Pin Column"')
            .expect(await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Pin Column', 'Account', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Freeze Up to This Column"')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account',
                    'Simple'
                )
            )
            .toBe(false);

        // Step 2: Pin column, convert AG grid to compound grid

        await baseContainer.changeViz('Compound Grid', 'Simple', true);

        await since('The Compound grid cell at row 1, column 1 should have text "Abbot Industries"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 1, 'Simple'))
            .toBe('Abbot Industries');

        await since('The Compound grid cell at row 1, column 2 should have text "Customer"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 2, 'Simple'))
            .toBe('Customer');

        await since('The Compound grid cell at row 1, column 3 should have text "Zachery Whitney"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 3, 'Simple'))
            .toBe('Zachery Whitney');

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Pin Column"')
            .expect(await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Pin Column', 'Account', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Freeze Up to This Column"')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account',
                    'Simple'
                )
            )
            .toBe(false);

        // Step 3: Freeze column, convert AG grid to normal grid
        await baseContainer.changeViz('Grid (Modern)', 'Simple', true);
        await browser.pause(2000);

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive',
            'Freeze Up to This Column',
            null,
            'Simple'
        );

        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Simple');
        await verifyColumnHeaderByIndex('Account Level', 'left', 2, 'Simple');
        await verifyColumnHeaderByIndex('Account Executive', 'left', 3, 'Simple');
        await verifyPinnedAreaIndicator('Account Executive', 'left', 'Simple');

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await baseContainer.changeViz('Grid', 'Simple', true);

        await since('The classic grid cell at row 1, column 1 should have text "Account"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Simple').getText())
            .toBe('Account');

        await since('The classic grid cell at row 1, column 2 should have text "Account Level"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Simple').getText())
            .toBe('Account Level');

        await since('The classic grid cell at row 1, column 3 should have text "Account Executive"')
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Simple').getText())
            .toBe('Account Executive');

        await since('The context menu should not contain "Pin Column"')
            .expect(await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Pin Column', 'Account', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Freeze Up to This Column"')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account',
                    'Simple'
                )
            )
            .toBe(false);

        // Step 4: Freeze column, convert AG grid to compound grid
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        // await verifyPinnedAreaIndicator('Account Executive', 'left', 'Simple');

        await baseContainer.changeViz('Compound Grid', 'Simple', true);

        await since('The Compound grid cell at row , column 1 should have text "Abbot Industries"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 1, 'Simple'))
            .toBe('Abbot Industries');

        await since('The Compound grid cell at row 1, column 2 should have text "Customer"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 2, 'Simple'))
            .toBe('Customer');

        await since('The Compound grid cell at row 1, column 3 should have text "Zachery Whitney"')
            .expect(await compoundGridVisualization.getGridCellTextByPosition(2, 3, 'Simple'))
            .toBe('Zachery Whitney');

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Simple'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Pin Column"')
            .expect(await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell('Pin Column', 'Account', 'Simple'))
            .toBe(false);

        await since('The context menu should not contain "Freeze Up to This Column"')
            .expect(
                await vizPanelForGrid.isContextMenuOptionPresentInHeaderCell(
                    'Freeze Up to This Column',
                    'Account',
                    'Simple'
                )
            )
            .toBe(false);
    });

    it('[TC94224_6] should handle freezing, excluding, and keeping only columns in AG Grid', async () => {
        // Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Switch to the "Crosstab" page in "Chapter 1"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Crosstab' });

        // 1. Freeze, exclude non-anchor point element
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2020 Q1',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 7, 'Visualization 1');
        await since('The group column "2020 Q1" should be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBe(true);
        await since('The group column "2020 Q2" should not be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q2', 'Visualization 1').isExisting()
            )
            .toBe(false);

        await agGridVisualization.openContextSubMenuItemForHeader('2019 Q3', 'Exclude', null, 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 6, 'Visualization 1');
        await since('The group column "2020 Q1" should still be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBe(true);
        await since('The group column "2020 Q2" should still not be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q2', 'Visualization 1').isExisting()
            )
            .toBe(false);

        await since('The grid cell at row 2, column 4 should have text "2019 Q2"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 4, 'Visualization 1'))
            .toBe('2019 Q2');
        await since('The grid cell at row 2, column 5 should have text "2019 Q4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('2019 Q4');

        // 2. Freeze, keep only the anchor point
        await agGridVisualization.openContextSubMenuItemForHeader('2020 Q1', 'Keep Only', null, 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 3, 'Visualization 1');
        await since('The group column "2020 Q1" should be in the frozen area')
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBe(true);
        await since('The grid cell at row 2, column 3 should have text "2020 Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 3, 'Visualization 1'))
            .toBe('2020 Q1');
        await since('The grid cell at row 3, column 4 should have text "Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 4, 'Visualization 1'))
            .toBe('Q1');
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive', 'left', 2, 'Visualization 1');

        // Undo twice and verify
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 7, 'Visualization 1');

        // 3. Freeze, exclude the anchor point
        await agGridVisualization.openContextSubMenuItemForHeader('2020 Q1', 'Exclude', null, 'Visualization 1');
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 2, column 6 should have text "2019 Q4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('2019 Q4');
        await since('The grid cell at row 2, column 7 should have text "2020 Q2"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 7, 'Visualization 1'))
            .toBe('2020 Q2');

        // Undo and verify
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);

        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 7, 'Visualization 1');

        // 4. Freeze, exclude upper level column header
        await agGridVisualization.openContextSubMenuItemForHeader('2020', 'Exclude', null, 'Visualization 1');
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 2, column 6 should have text "2019 Q4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('2019 Q4');
        await since('The grid cell at row 2, column 7 should have text "2021 Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 7, 'Visualization 1'))
            .toBe('2021 Q1');

        // Undo and verify
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await browser.pause(2000);
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 7, 'Visualization 1');

        // 5. Freeze, keep only the non-anchor point
        await agGridVisualization.openContextSubMenuItemForHeader('2019', 'Keep Only', null, 'Visualization 1');
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 2, column 6 should have text "2019 Q4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 6, 'Visualization 1'))
            .toBe('2019 Q4');
        await since('The grid cell at row 3, column 7 should have text "Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 7, 'Visualization 1'))
            .toBe('Q1');

        // Freeze "Q2" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Q2',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Q1', 'left', 7, 'Visualization 1');
        await since('The column "Q2" should be in the frozen area')
            .expect(await agGridVisualization.getColHeaderCellInFrozenArea('Q2', 'Visualization 1').isExisting())
            .toBe(true);
        await since('The column "Q4" should not be in the frozen area')
            .expect(await agGridVisualization.getColHeaderCellInFrozenArea('Q4', 'Visualization 1').isExisting())
            .toBe(false);

        // Exclude "Q4" and verify
        await agGridVisualization.openContextSubMenuItemForHeader('Q4', 'Exclude', null, 'Visualization 1');
        await verifyPinnedAreaIndicator('Q2', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Q2', 'left', 7, 'Visualization 1');
        await since('The grid cell at row 3, column 5 should have text "2019 Q3"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 5, 'Visualization 1'))
            .toBe('2019 Q3');
        await since('The grid cell at row 3, column 6 should have text "Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 6, 'Visualization 1'))
            .toBe('Q1');
    });

    it('[TC94224_7] should handle pinning, freezing, and replacing objects in AG Grid', async () => {
        // Open the dossier by its ID
        await libraryPage.editDossierByUrl({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Switch to the "Crosstab" page in "Chapter 1"
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Crosstab' });

        // 1. Freeze, replace non-anchor point object
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive', 'left', 'Visualization 1');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account',
            'Replace With',
            'Category',
            'Visualization 1'
        );
        await since('The grid cell at row 1, column 1 should have text "Category"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Category');
        await verifyColumnHeaderByIndex('Category', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive', 'left', 'Visualization 1');

        // 2. Freeze, replace anchor point object
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive',
            'Replace With',
            'Country',
            'Visualization 1'
        );
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 3, column 1 should have text "Category"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Category');
        await since('The grid cell at row 3, column 2 should have text "Country"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Country');
        await since('The context menu should not contain "Unfreeze All Columns"')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unfreeze All Columns',
                    'Country',
                    'Visualization 1'
                )
            )
            .toBe(false);

        // 3. Freeze crosstab, replace with
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2019 Q3',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Category', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country', 'left', 2, 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 5, 'Visualization 1');
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await since('The column "2019 Q4" should not be in the frozen area')
            .expect(await agGridVisualization.getColHeaderCellInFrozenArea('2019 Q4', 'Visualization 1').isExisting())
            .toBe(false);

        await editorPanelForGrid.replaceObjectByName('Year', 'Attribute', 'Region', 'Attribute');

        await since('The grid cell at row 1, column 3 should have text "APAC"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('APAC');
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The context menu should not contain "Unfreeze All Columns"')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unfreeze All Columns',
                    'Country',
                    'Visualization 1'
                )
            )
            .toBe(false);

        // 4. Pin, replace non-anchor point object
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Category',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        await verifyPinnedAreaIndicator('Country', 'left', 'Visualization 1');
        await verifyPinnedAreaIndicator('Category', 'right', 'Visualization 1');
        await verifyColumnHeaderByIndex('Category', 'right', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country', 'left', 1, 'Visualization 1');

        await editorPanelForGrid.replaceObjectByName('Region', 'Attribute', 'Year', 'Attribute');

        await since('The grid cell at row 1, column 3 should have text "2019"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('2019');
        await verifyPinnedAreaIndicator('Country', 'left', 'Visualization 1');
        await verifyPinnedAreaIndicator('Category', 'right', 'Visualization 1');
        await verifyColumnHeaderByIndex('Category', 'right', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country', 'left', 1, 'Visualization 1');

        // 5. Pin, replace anchor point object
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Category',
            'Replace With',
            'Account',
            'Visualization 1'
        );
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 3, column 1 should have text "Country"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Country');

        await since('The grid cell at row 3, column 2 should have text "Account"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Account');

        await verifyPinnedAreaIndicator('Country', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Country', 'left', 1, 'Visualization 1');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Country',
            'Replace With',
            'Account Executive',
            'Visualization 1'
        );
        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);
        await since('The grid cell at row 3, column 1 should have text "Account"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 1, 'Visualization 1'))
            .toBe('Account');
        await since('The grid cell at row 3, column 2 should have text "Account Executive"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 2, 'Visualization 1'))
            .toBe('Account Executive');

        await since('The context menu should not contain "Unfreeze All Columns"')
            .expect(
                await agGridVisualization.isContextMenuOptionPresentInHeaderCell(
                    'Unfreeze All Columns',
                    'Account',
                    'Visualization 1'
                )
            )
            .toBe(false);
    });
});
