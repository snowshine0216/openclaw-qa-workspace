import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';
import EditorPanel from '../../../pageObjects/dossierEditor/EditorPanel.js';
import VizPanelForGrid from '../../../pageObjects/authoring/VizPanelForGrid.js';
import BaseContainer from '../../../pageObjects/authoring/BaseContainer.js';
import { dossier } from '../../../constants/teams.js';
import DatasetPanel from '../../../pageObjects/authoring/DatasetPanel.js';
import DatasetsPanel from '../../../pageObjects/dossierEditor/DatasetsPanel.js';
import DossierPage from '../../../pageObjects/dossier/DossierPage.js';

describe('Pin/Freeze in AG Grid', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, dossierPage, agGridVisualization, grid, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.resetDossierIfPossible();
        await browser.pause(5000);
    });

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
            await since(`The visible indicator of ${pinArea} pin area should be on "${columnName}"`)
                .expect(txt)
                .toBe(columnName);
        } else {
            await since(`The visible indicator of ${pinArea} pin area should not be on "${columnName}"`)
                .expect(txt)
                .not.toBe(columnName);
        }
    }

    it('[TC94227_1] should pin and unpin columns in AG Grid in consumption mode', async () => {
        // Open the dossier in Presentation mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });

        // Verify dossier is refreshed in Library consumption mode
        // await since('Dossier should be refreshed in Library consumption mode')
        //     .expect(await libraryPage.isDossierInConsumptionMode())
        //     .toBe(true);
        await dossierPage.resetDossierIfPossible();
        await browser.pause(5000);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Normal' });

        await agGridVisualization.clickOnContainerTitle('Visualization 1');

        // Step 1.1: Verify no visible indicators in pin areas
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBe(false);

        // Pin "Account Executive ID" to the left and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 1, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        // Pin "Account Level ID" to the left and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level ID',
            'Pin Column',
            'to the Left',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Level ID', 'left', 'Visualization 1');

        // Pin "Account ID" to the right and verify scrolling
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

        // Pin "Parts ($)" to the right and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Parts ($)',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Parts ($)', 'right', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account ID', 'right', 'Visualization 1');

        // Scroll and pin "Total ($) Comparison by Region" to the right
        await agGridVisualization.scrollHorizontally('right', 500, 'Visualization 1');
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Total ($) Comparison by Region',
            'Pin Column',
            'to the Right',
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Total ($) Comparison by Region', 'right', 3, 'Visualization 1');

        // Unpin all columns and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account ID',
            'Unpin All Columns',
            null,
            'Visualization 1'
        );

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBeFalse();

        await since('The right pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('right', 'Visualization 1'))
            .toBeFalse();

        await since('The column "Account Executive ID" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Account Executive ID', 'Visualization 1')
                    .isExisting()
            )
            .toBeFalse();

        await since('The column "Account Level ID" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Account Level ID', 'Visualization 1')
                    .isExisting()
            )
            .toBe(false);

        await since('The column "Account ID" should not be in the frozen area')
            .expect(
                await agGridVisualization.getColHeaderCellInFrozenArea('Account ID', 'Visualization 1').isExisting()
            )
            .toBe(false);

        await since('The column "Parts ($)" should not be in the frozen area')
            .expect(await agGridVisualization.getColHeaderCellInFrozenArea('Parts ($)', 'Visualization 1').isExisting())
            .toBe(false);

        await since('The column "Total ($) Comparison by Region" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Total ($) Comparison by Region', 'Visualization 1')
                    .isExisting()
            )
            .toBe(false);
    });

    it('[TC94227_2] should freeze, keep only, exclude, and unfreeze columns in AG Grid in Consumption mode', async () => {
        // Open the dossier in Presentation mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridPinFreeze.project.id,
            dossierId: gridConstants.AGGridPinFreeze.id,
        });
        await dossierPage.resetDossierIfPossible();
        await browser.pause(5000);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Normal' });
        // Verify no visible indicators in pin areas
        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        // Freeze "Account Executive ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Executive ID',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account ID', 'left', 1, 'Visualization 1');
        await verifyColumnHeaderByIndex('Account Executive ID', 'left', 2, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Executive ID', 'left', 'Visualization 1');

        // Freeze "Account Level ID" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account Level ID',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyColumnHeaderByIndex('Account Level ID', 'left', 3, 'Visualization 1');
        await verifyPinnedAreaIndicator('Account Level ID', 'left', 'Visualization 1');

        // Freeze "2020" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2020',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await browser.pause(2000);
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 11, 'Visualization 1');
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

        // Keep Only "2020" and verify
        await agGridVisualization.openContextSubMenuItemForHeader('2020', 'Keep Only', null, 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 7, 'Visualization 1');
        await since(`The group column "2020 Q1" should be in the frozen area`)
            .expect(
                await agGridVisualization.getGroupColHeaderCellInFrozenArea('2020 Q1', 'Visualization 1').isExisting()
            )
            .toBe(true);

        await verifyColumnHeaderByIndex('Country ID', 'left', 4, 'Visualization 1');
        await verifyColumnHeaderByIndex('Country Latitude', 'left', 5, 'Visualization 1');

        await since('The grid cell at row 2, column 7 should have text "2020 Q1"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 7, 'Visualization 1'))
            .toBe('2020 Q1');

        await since('The grid cell at row 1, column 10 should have text "2020"')
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 10, 'Visualization 1'))
            .toBe('2020');

        await since('The grid cell at row 1, column 5 should have text "Country Longitude"')
            .expect(await agGridVisualization.getGridCellTextByPosition(3, 6, 'Visualization 1'))
            .toBe('Country Longitude');

        // Freeze "2020 Q4" and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            '2020 Q4',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        await verifyPinnedAreaIndicator('Units Sold', 'left', 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 10, 'Visualization 1');

        const frozenGroupColumnsAfterQ4 = ['2020 Q1', '2020 Q2', '2020 Q3', '2020 Q4'];
        for (const groupColumn of frozenGroupColumnsAfterQ4) {
            await since(`The group column "${groupColumn}" should be in the frozen area`)
                .expect(
                    await agGridVisualization
                        .getGroupColHeaderCellInFrozenArea(groupColumn, 'Visualization 1')
                        .isExisting()
                )
                .toBe(true);
        }

        // Exclude "2020 Q3" and verify
        await agGridVisualization.openContextSubMenuItemForHeader('2020 Q3', 'Exclude', null, 'Visualization 1');
        await verifyColumnHeaderByIndex('Units Sold', 'left', 9, 'Visualization 1');

        const frozenGroupColumnsAfterExclude = ['2020 Q1', '2020 Q2', '2020 Q4'];
        for (const groupColumn of frozenGroupColumnsAfterExclude) {
            await since(`The group column "${groupColumn}" should be in the frozen area`)
                .expect(
                    await agGridVisualization
                        .getGroupColHeaderCellInFrozenArea(groupColumn, 'Visualization 1')
                        .isExisting()
                )
                .toBe(true);
        }

        await since('The grid cell at row 2, column 8 should have text "2020 Q2"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 8, 'Visualization 1'))
            .toBe('2020 Q2');

        await since('The grid cell at row 2, column 9 should have text "2020 Q4"')
            .expect(await agGridVisualization.getGridCellTextByPosition(2, 9, 'Visualization 1'))
            .toBe('2020 Q4');

        // Unfreeze all columns and verify
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Account ID',
            'Unfreeze All Columns',
            null,
            'Visualization 1'
        );

        await since('The left pin area should not have a visible indicator')
            .expect(await agGridVisualization.isPinIndicatorVisible('left', 'Visualization 1'))
            .toBe(false);

        await since('The column "Account Executive ID" should not be in the frozen area')
            .expect(
                await agGridVisualization
                    .getColHeaderCellInFrozenArea('Account Executive ID', 'Visualization 1')
                    .isExisting()
            )
            .toBe(false);

        await grid.openViewFilterContainer('Visualization 1');
        await grid.clearViewFilter('Clear All');
    });
});
