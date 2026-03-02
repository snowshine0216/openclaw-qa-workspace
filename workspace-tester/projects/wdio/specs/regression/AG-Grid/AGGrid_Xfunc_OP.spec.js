import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AGGrid_Xfunc_OP', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        agGridVisualization,
        toc,
        rsdPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        // Reset dossier state before each test
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_Object_Parameter,
        });
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[BCED-2391] Freeze up to the column cannot work for OP', async () => {
        // Open the dossier: C3F6D0F4554B05B5B02E79B73CA41EE0 in consumption mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Object_Parameter.project.id,
            dossierId: gridConstants.AGGrid_Object_Parameter.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierPage.hidePageIndicator();
        // Freeze up to the column 'Supplier'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Supplier',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_1',
            'Freeze up to attribute OP column in consumption mode'
        );

        // Freeze up to the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_2',
            'Freeze up to metric OP column in consumption mode'
        );
        //Unfreeze all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Unfreeze All Columns',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_3',
            'Unfreeze all columns in consumption mode'
        );

        // switch to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Freeze up to the column 'Supplier'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Supplier',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_4',
            'Freeze up to attribute OP column in autoring mode'
        );

        // Freeze up to the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_5',
            'Freeze up to metric OP column in authoring mode'
        );
        //Unfreeze all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Unfreeze All Columns',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-2391_6',
            'Unfreeze all columns in authoring mode'
        );
    });

    it('[BCED-3720] Hide column cannot work for OP', async () => {
        // Open the dossier: C3F6D0F4554B05B5B02E79B73CA41EE0 in consumption mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Object_Parameter.project.id,
            dossierId: gridConstants.AGGrid_Object_Parameter.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierPage.hidePageIndicator();
        // Hide the column 'Supplier'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Supplier',
            'Hide Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_1',
            'Hide attribute OP column in consumption mode'
        );

        // Hide the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Hide Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_2',
            'Hide metric OP column in consumption mode'
        );
        //Unhide all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Unhide All Columns',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_3',
            'Unhide all columns in consumption mode'
        );

        // switch to edit mode
        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');
        // Hide the column 'Supplier'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Supplier',
            'Hide Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_4',
            'Hide attribute OP column in authoring mode'
        );

        // Hide the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Hide Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_5',
            'Hide metric OP column in authoring mode'
        );
        //Unhide all columns
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Unhide All Columns',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-3720_6',
            'Unhide all columns in authoring mode'
        );
    });

    it('[BCED-6359] Freeze up to a column with merged cell column header, then hide another column, the freeze indicator is gone', async () => {
        // Open the dossier: C3F6D0F4554B05B5B02E79B73CA41EE0 in consumption mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_Object_Parameter.project.id,
            dossierId: gridConstants.AGGrid_Object_Parameter.id,
        });
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await dossierPage.hidePageIndicator();
        // Freeze up to the merged cell column header 'Jan'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Jan',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-6359_1',
            'Freeze up to Jan column in consumption mode'
        );

        // Hide the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Hide Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-6359_2',
            'Hide metric OP column in consumption mode'
        );

        await dossierPage.clickEditIcon();
        await dossierPage.waitForDossierLoading();
        await agGridVisualization.clickOnContainerTitle('Visualization 1');

        await agGridVisualization.openContextSubMenuItemForHeader(
            'Jan',
            'Freeze Up to This Column',
            null,
            'Visualization 1'
        );
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-6359_3',
            'Freeze up to Jan column in authoring mode'
        );

        // Hide the column 'Cost'
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Cost',
            'Hide Column',
            null,
            'Visualization 1'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCED-6359_4',
            'Hide metric OP column in authoring mode'
        );
    });

    it('[BCIN-5877] You have included an invalid argument error when using Modern Grid xfunc with object parameter', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGrid_OP_Error,
        });
        // Open the dossier: B902F051854AF556A0F4D589A1455EC1 in consumption mode
        await libraryPage.openDossierById({
            projectId: gridConstants.AGGrid_OP_Error.project.id,
            dossierId: gridConstants.AGGrid_OP_Error.id,
        });
        await dossierPage.hidePageIndicator();
        const selector = rsdPage.findSelectorByName('Opportunities Parameter');
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Yes', false);
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('All', false);
        await selector.dropdown.openDropdown();
        await selector.dropdown.selectItemByText('Yes', false);
        await browser.pause(2000);
        // take screenshot
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'BCIN-5877_1',
            'Should not show error when switch OP selector'
        );
    });
});
