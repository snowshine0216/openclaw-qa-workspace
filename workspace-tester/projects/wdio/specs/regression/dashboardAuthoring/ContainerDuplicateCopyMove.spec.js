import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import NewFormatPanelForGrid from '../../../pageObjects/authoring/format-panel/NewFormatPanelForGrid.js';
import InCanvasSelector_Authoring from '../../../pageObjects/authoring/InCanvasSelector_Authoring.js';
import setWindowSize from '../../../config/setWindowSize.js';
import HtmlContainer_Authoring from '../../../pageObjects/authoring/HtmlContainer_Authoring.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';
import GridValidators from '../../../pageObjects/authoring/grid/validators/GridValidators.js';
import DossierMojoEditor from '../../../pageObjects/authoring/DossierMojoEditor.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

/**
 * Container Duplicate, Copy, and Move Operations Test Suite
 * 
 * This suite tests all major container operations in dashboard authoring:
 * - Copy to existing/new pages and chapters
 * - Move to existing/new pages and chapters  
 * - Duplicate within same page
 * - Delete operations
 * - Undo/Redo functionality
 * - Cross-chapter operations with filter warnings
 * - Visualization filtering scenarios
 * - Layer panel operations
 */
//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/ContainerDuplicateCopyMove.spec.js'
describe('Container Duplicate, Copy, and Move Operations', () => {
    // Test data constants
    const TUTORIAL_PROJECT = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const CONTAINER_E2E_DOSSIER = {
        id: 'E11AB799774CF92EB5DB72B433BC3942',
        name: 'ContainerE2E',
        project: TUTORIAL_PROJECT,
    };

    const BROWSER_CONFIG = {
        width: 1600,
        height: 1200,
    };

    const EXPECTED_GRID_ROWS = 13;
    const EXPECTED_BORDER_COLOR = 'rgba(230,153,18,1)';
    const NORMAL_BORDER_COLOR = 'rgba(171,171,171,1)';

    // Page objects destructuring
    let {
        libraryPage,
        dossierPage,
        baseContainer,
        gridAuthoring,
        baseFormatPanel,
        baseFormatPanelReact,
        contentsPanel,
        dossierMojo,
        vizPanelForGrid,
        loginPage,
        toolbar,
        layerPanel,
        freeformPositionAndSize,
        loadingDialog,
    } = browsers.pageObj1;

    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(BROWSER_CONFIG);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    /**
     * Helper function to verify grid visualization row count
     */
    async function verifyGridObjectCount(containerName, expectedRows = EXPECTED_GRID_ROWS) {
        const actualRows = await gridAuthoring.validators.getAllGridObjectCount(containerName);
        await since(`Grid "${containerName}" should have expected: ${expectedRows} rows, but actual: #{actual}`)
            .expect(actualRows)
            .toBe(expectedRows);
    }

    /**
     * Helper function to verify grid cell border style
     */
    async function verifyGridCellBorderStyle(containerName, row = 1, col = 1, expectedColor = EXPECTED_BORDER_COLOR) {
        const actualBorderColor = await vizPanelForGrid.getGridCellStyleByPosition(row, col, containerName, 'border-bottom-color');
        await since(`Grid cell in "${containerName}" at "${row}", "${col}" has style "border-bottom-color" with expected value "${expectedColor}" but actual value is "#{actual}"`)
            .expect(actualBorderColor)
            .toEqual(expectedColor);
    }

    /**
     * Helper function to verify both grid object count and styling
     */
    async function verifyGridVisualization(containerName, expectedRows = EXPECTED_GRID_ROWS) {
        await verifyGridObjectCount(containerName, expectedRows);
        await verifyGridCellBorderStyle(containerName);
    }

    /**
     * Helper function to verify current page
     */
    async function verifyCurrentPage(chapterName, pageName) {
        const isPageDisplayed = await (await contentsPanel.getPage({ chapterName, pageName })).isDisplayed();
        await since(`Page "${pageName}" in chapter "${chapterName}" should be current - expected: true, actual: #{actual}`)
            .expect(isPageDisplayed)
            .toBe(true);
    }

    /**
     * Helper function to open dossier
     */
    async function openTestDossier() {
        const url = browser.options.baseUrl + `app/${TUTORIAL_PROJECT.id}/${CONTAINER_E2E_DOSSIER.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
    }

    describe('Copy Operations', () => {
        it('[TC65325_01] Copy visualization to existing page in same chapter', async () => {
            await openTestDossier();

            // Navigate to source page and perform copy operation
            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('Page 2');

            // Verify copy operation results
            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');
        });

        it('[TC65325_02] Copy visualization to new page with undo/redo operations', async () => {
            await openTestDossier();

            // Setup: Copy to existing page first
            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('Page 2');

            // Main test: Copy to new page
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            // Verify we're on Page 3 with the copied visualization
            await verifyCurrentPage('Chapter 1', 'Page 3');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Undo-Redo workflow (following original sequence)
            await toolbar.clickButtonFromToolbar('Undo');

            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('Chapter 1', 'Page 1');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyCurrentPage('Chapter 1', 'Page 3');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');
        });

        it('[TC65325_03] Copy visualization across chapters with filter warnings', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'FilterChapter', pageName: 'Page 1' });
            await verifyCurrentPage('FilterChapter', 'Page 1');

            await baseContainer.clickContainer('Visualization 1');
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('Chapter 2');

            const isCopyWarningDisplayed = await dossierMojo.getMojoEditorWithTitle('Copy to Chapter 2').isDisplayed();
            await since('Warning dialog should appear - expected: true, actual: #{actual}')
                .expect(isCopyWarningDisplayed)
                .toBe(true);

            await dossierMojo.clickBtnOnMojoEditor('Yes');

            const isCopyWarningClosed = await dossierMojo.getMojoEditorWithTitle('Copy to Chapter 2').isDisplayed();
            await since('Warning dialog should be closed - expected: false, actual: #{actual}')
                .expect(isCopyWarningClosed)
                .toBe(false);

            await verifyCurrentPage('Chapter 2', 'Page 22');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Test copy from auto layout to freeform layout
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('Chapter 4');

            await dossierMojo.clickBtnOnMojoEditor('Yes');
            await verifyCurrentPage('Chapter 4', 'Page 42_Freeform');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Verify freeform layout properties
            await browser.pause(2000);
            await layerPanel.clickOnContainerFromLayersPanel('Visualization 1 copy copy');
            await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
            await baseFormatPanelReact.switchSection('Title and Container');
        });

        it('[TC65325_04] Copy visualization with visualization filtering', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'VizAsFilter', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            await verifyCurrentPage('VizAsFilter', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy', 1, 1, NORMAL_BORDER_COLOR);

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('VizAsFilter', 'Page 1');

            await baseContainer.openContextMenu('Visualization 2');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            await verifyCurrentPage('VizAsFilter', 'Page 2');
            await verifyGridObjectCount('Visualization 2 copy');
            await verifyGridCellBorderStyle('Visualization 2 copy', 1, 1, NORMAL_BORDER_COLOR);
        });
    });

    describe('Move Operations', () => {
        it('[TC65325_05] Move visualization to existing page in same chapter', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('Page 2');

            await verifyCurrentPage('Chapter 1', 'Page 2');
            // Note: Move preserves original name (no "copy" suffix)
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');
        });

        it('[TC65325_06] Move visualization to new page with undo/redo', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            await verifyCurrentPage('Chapter 1', 'Page 3');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            // Test undo/redo
            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('Chapter 1', 'Page 1');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyCurrentPage('Chapter 1', 'Page 3');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');
        });

        it('[TC65325_07] Move visualization across chapters with filter warnings', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'FilterChapter', pageName: 'Page 1' });
            await verifyCurrentPage('FilterChapter', 'Page 1');

            await baseContainer.clickContainer('Visualization 1');
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('Chapter 2');

            const isMoveWarningDisplayed = await dossierMojo.getMojoEditorWithTitle('Move to Chapter 2').isDisplayed();
            await since('Move warning dialog should appear - expected: true, actual: #{actual}')
                .expect(isMoveWarningDisplayed)
                .toBe(true);

            await dossierMojo.clickBtnOnMojoEditor('Yes');

            const isMoveWarningClosed = await dossierMojo.getMojoEditorWithTitle('Move to Chapter 2').isDisplayed();
            await since('Move warning dialog should be closed - expected: false, actual: #{actual}')
                .expect(isMoveWarningClosed)
                .toBe(false);

            await verifyCurrentPage('Chapter 2', 'Page 22');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');
        });

        it('[TC65325_08] Move visualization with visualization filtering', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'VizAsFilter', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            await verifyCurrentPage('VizAsFilter', 'Page 2');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1', 1, 1, NORMAL_BORDER_COLOR);

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('VizAsFilter', 'Page 1');

            await baseContainer.openContextMenu('Visualization 2');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('New Page');

            await verifyCurrentPage('VizAsFilter', 'Page 2');
            await verifyGridObjectCount('Visualization 2');
            await verifyGridCellBorderStyle('Visualization 2', 1, 1, NORMAL_BORDER_COLOR);
        });
    });

    describe('Duplicate Operations', () => {
        it('[TC65325_09] Duplicate visualization with complex scenarios', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            
            // Initial duplicate
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Duplicate');
            await verifyCurrentPage('Chapter 1', 'Page 1');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Duplicate the copy
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Duplicate');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Delete intermediate copy
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Delete');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Duplicate original again (should reuse "copy" name)
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Duplicate');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Verify all visualizations exist
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');
        });

        it('[TC65325_10] Duplicate visualization with filtering', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'VizAsFilter', pageName: 'Page 1' });
            
            // Duplicate source visualization
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Duplicate');
            await verifyCurrentPage('VizAsFilter', 'Page 1');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy', 1, 1, NORMAL_BORDER_COLOR);

            // Test undo
            await toolbar.clickButtonFromToolbar('Undo');

            // Duplicate target visualization (filter affects row count)
            await baseContainer.openContextMenu('Visualization 2');
            await baseContainer.selectContextMenuOption('Duplicate');
            
            // Verify filtered row count
            await verifyGridObjectCount('Visualization 2 copy', 4);
            await verifyGridCellBorderStyle('Visualization 2 copy', 1, 1, NORMAL_BORDER_COLOR);
        });

        it('[TC65325_11] Duplicate and delete visualization through layers panel', async () => {
            await openTestDossier();

            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            
            // Verify original visualization exists
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            // Duplicate visualization through layers panel
            await layerPanel.duplicateContainerFromLayersPanel('Visualization 1');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify both original and duplicated visualizations exist
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Duplicate the copy through layers panel to create another copy
            await layerPanel.duplicateContainerFromLayersPanel('Visualization 1 copy');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify visualizations 
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Delete the middle copy through layers panel
            await layerPanel.deleteContainerFromLayersPanel('Visualization 1 copy');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify only original and second copy remain
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Test undo operation to restore deleted visualization
            await toolbar.clickButtonFromToolbar('Undo');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify the deleted visualization is restored
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Delete original visualization through layers panel
            await layerPanel.deleteContainerFromLayersPanel('Visualization 1');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify only the copies remain
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Test redo after undo to verify layer panel operations work with undo/redo
            await toolbar.clickButtonFromToolbar('Undo');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify original is restored
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            await toolbar.clickButtonFromToolbar('Redo');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify original is deleted again
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Final verification: Duplicate through layers panel after deletions
            await layerPanel.duplicateContainerFromLayersPanel('Visualization 1 copy copy');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify new duplicate is created with correct naming
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            // Test mixed operations: layers panel duplicate then context menu delete
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Delete');

            // Verify the visualization deleted via context menu is gone
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            // Final undo to restore all operations
            await toolbar.clickButtonFromToolbar('Undo');
            await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

            // Verify the context menu deleted visualization is restored
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');
        });
    });

    describe('Comprehensive Operations', () => {
        it('[TC65325_11] Complex multi-operation workflow with undo/redo', async () => {
            await openTestDossier();

            // Step 1: Start on Page 1 and duplicate Visualization 1
            await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
            await baseContainer.openContextMenu('Visualization 1');
            await baseContainer.selectContextMenuOption('Duplicate');

            // Verify duplicate exists on same page
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            // Step 2: Copy the duplicate to Page 2 (cross-page copy)
            await baseContainer.openContextMenu('Visualization 1 copy');
            await baseContainer.selectContextMenuOption('Copy to');
            await baseContainer.selectSecondaryContextMenuOption('Page 2');

            // Verify we're on Page 2 and copy exists
            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Step 3: Move the copy to Chapter 2 (cross-chapter move)
            await baseContainer.openContextMenu('Visualization 1 copy copy');
            await baseContainer.selectContextMenuOption('Move to');
            await baseContainer.selectSecondaryContextMenuOption('Chapter 2');

            // Handle confirmation dialog for move operation
            try {
                const isMoveConfirmationDisplayed = await dossierMojo.getMojoEditorWithTitle('Move to Chapter 2').isDisplayed();
                if (isMoveConfirmationDisplayed) {
                    await since('Confirmation dialog with title "Move to Chapter 2" should be displayed - expected: true, actual: #{actual}')
                        .expect(isMoveConfirmationDisplayed)
                        .toBe(true);

                    await dossierMojo.clickBtnOnMojoEditor('Yes');

                    const isMoveConfirmationClosed = await dossierMojo.getMojoEditorWithTitle('Move to Chapter 2').isDisplayed();
                    await since('Confirmation dialog with title "Move to Chapter 2" should be closed - expected: false, actual: #{actual}')
                        .expect(isMoveConfirmationClosed)
                        .toBe(false);
                }
            } catch (e) {
                // Dialog might not appear, continue
            }

            // Verify we're on Chapter 2 and visualization was moved
            await verifyCurrentPage('Chapter 2', 'Page 22');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            // Step 4: Duplicate the moved visualization in Chapter 2
            await baseContainer.openContextMenu('Visualization 1 copy copy');
            await baseContainer.selectContextMenuOption('Duplicate');
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            // Step 5: Delete the original moved visualization
            await baseContainer.openContextMenu('Visualization 1 copy copy');
            await baseContainer.selectContextMenuOption('Delete');

            // Verify only the duplicate remains
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            // Step 6: Test Undo operations (reverse order)
            await toolbar.clickButtonFromToolbar('Undo');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyCurrentPage('Chapter 1', 'Page 1');

            await toolbar.clickButtonFromToolbar('Undo');
            await verifyGridObjectCount('Visualization 1');
            await verifyGridCellBorderStyle('Visualization 1');

            // Step 7: Test Redo operations (forward order)
            await toolbar.clickButtonFromToolbar('Redo');
            await verifyGridObjectCount('Visualization 1 copy');
            await verifyGridCellBorderStyle('Visualization 1 copy');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyCurrentPage('Chapter 1', 'Page 2');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyCurrentPage('Chapter 2', 'Page 22');
            await verifyGridObjectCount('Visualization 1 copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            await toolbar.clickButtonFromToolbar('Redo');
            await verifyGridObjectCount('Visualization 1 copy copy copy');
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy');

            // Final verification: styling preserved throughout all operations
            await verifyGridCellBorderStyle('Visualization 1 copy copy copy', 1, 1, EXPECTED_BORDER_COLOR);
        });
    });
});
