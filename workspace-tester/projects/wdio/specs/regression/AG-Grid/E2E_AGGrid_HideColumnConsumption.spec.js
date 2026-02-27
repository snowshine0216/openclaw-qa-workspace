import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('E2E_AGGrid_HideColumnConsumption', () => {
    const newTutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorial',
    };
    const agGridElementType = {
        id: 'FF37BC6D46405408F3D2E9BB7BE5D0B7',
        name: 'AGGrid_ElementType',
        project: newTutorialProject,
    };
    const agGridOutline = {
        id: 'E90C1133A049BCE361A8F6B071FB242D',
        name: 'AGGrid_Outline',
        project: newTutorialProject,
    };
    const agGridFormatting = {
        id: 'E26BF608B14F1EA61086F3A61034AE21',
        name: 'AGGrid_Formatting',
        project: newTutorialProject,
    };
    const agGridPin = {
        id: 'BFFDE282494CB1544E027CBBBE83B015',
        name: 'AGGrid.HideColumn_PIN',
        project: newTutorialProject,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, agGridVisualization, toc, grid, vizPanelForGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.hideColumnUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99056_1] Validate Hide column E2E user journey - Multiple Attribute Forms', async () => {
        await resetDossierState({
            credentials: gridConstants.hideColumnUser,
            dossier: agGridElementType,
        });
        await libraryPage.openDossier(agGridElementType.name);
        await toc.openPageFromTocMenu({ chapterName: 'Element Type', pageName: 'Multiform Attribute' });
        await agGridVisualization.RMConColumnHeaderElement('Multiform Category', 'Show attribute form = OFF');
        await since('Hide column is enabled under consumption mode, Hide column option should be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Hide Column' }))
            .toBe(true);
        await agGridVisualization.selectContextMenuOption('Hide Column');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Show attribute form = OFF'),
            'TC99056_1_01',
            'Show attribute form = OFF'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Region',
            'Unhide All Columns',
            'Show attribute form = OFF'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Show attribute form = OFF'),
            'TC99056_1_02',
            'Unhide All Columns'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Multiform Category DESC',
            'Hide Column',
            'Show attribute form = ON'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Multiform Category ID',
            'Hide Column',
            'Show attribute form = ON'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Multiform Category Number',
            'Hide Column',
            'Show attribute form = ON'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Show attribute form = ON'),
            'TC99056_1_03',
            'Hide Multiform Category DESC ID Number Column'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Multiform Category DESC 2',
            'Hide Column',
            'Show attribute form = ON'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Show attribute form = ON'),
            'TC99056_1_04',
            'Hide All Forms for Multiform Category Columns'
        );
        await agGridVisualization.openContextMenu('Show attribute form = ON');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Show attribute form = ON'),
            'TC99056_1_05',
            'Unhide All Columns'
        );
    });

    it('[TC99056_2] Validate Hide column E2E user journey - Different type of elements', async () => {
        await libraryPage.openDossier(agGridElementType.name);
        await toc.openPageFromTocMenu({ chapterName: 'Element Type', pageName: 'DataType' });
        await agGridVisualization.openContextMenuItemForHeader(
            'Custom Categories',
            'Hide Column',
            'Consolidation / Custom Group'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Consolidation / Custom Group'),
            'TC99056_2_01',
            'Hide Custom Categories Column'
        );
        await agGridVisualization.openContextMenu('Consolidation / Custom Group');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Consolidation / Custom Group'),
            'TC99056_2_02',
            'Unhide All Columns'
        );
        // DE321295 Hide Column does Not work on Custom Group
        await agGridVisualization.openContextMenuItemForHeader(
            '2015 & 2016',
            'Hide Column',
            'Consolidation / Custom Group'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Consolidation / Custom Group'),
            'TC99056_2_03',
            'Hide 2015 & 2016 Column'
        );
        await agGridVisualization.openContextMenu('Consolidation / Custom Group');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Consolidation / Custom Group'),
            'TC99056_2_04',
            'Unhide All Columns'
        );
    });

    it('[TC99056_3] Validate Hide column E2E user journey - Hide column with Attribute link', async () => {
        await libraryPage.openDossier(agGridElementType.name);
        await toc.openPageFromTocMenu({ chapterName: 'Element Type', pageName: 'Attribute Link' });
        await agGridVisualization.openContextMenuItemForHeader(
            'Category(Link)',
            'Hide Column',
            'Attribute Link on Shared Axis'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Attribute Link on Shared Axis'),
            'TC99056_3_01',
            'Hide Category(Link) Column'
        );
        await agGridVisualization.openContextMenu('Attribute Link on Shared Axis');
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Attribute Link on Shared Axis'),
            'TC99056_3_02',
            'Unhide All Columns'
        );
    });

    it('[TC99056_4] Validate Hide column E2E user journey - Hide Column is disabled for outline mode', async () => {
        await resetDossierState({
            credentials: gridConstants.hideColumnUser,
            dossier: agGridOutline,
        });
        await libraryPage.openDossier(agGridOutline.name);
        await toc.openPageFromTocMenu({ chapterName: 'Outline', pageName: 'Outline' });
        await agGridVisualization.RMConColumnHeaderElement('Month', 'Compact');
        await since('Open grid context menu on AG grid outline mode, hide column should Not be appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Hide Column' }))
            .toBe(false);
    });

    it('[TC99056_5] Validate Hide column E2E user journey - Hide Column with Threshold', async () => {
        await resetDossierState({
            credentials: gridConstants.hideColumnUser,
            dossier: agGridFormatting,
        });
        await libraryPage.openDossier(agGridFormatting.name);
        await toc.openPageFromTocMenu({ chapterName: 'Formatting with Filter', pageName: 'Threshold' });
        await agGridVisualization.openContextMenuItemForHeader('Cost', 'Hide Column', 'Freeze Category');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Freeze Category'),
            'TC99056_5_01',
            'Hide Cost Column'
        );
        await agGridVisualization.openContextMenuItemForHeader('Item', 'Unhide All Columns', 'Freeze Category');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Freeze Category'),
            'TC99056_5_02',
            'Unhide Cost Column with threshold'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Cost Trend by Region',
            'Hide Column',
            'Freeze Category'
        );
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Freeze Category'),
            'TC99056_5_03',
            'Hide Cost Trend by Region Columnset'
        );
        await agGridVisualization.openContextMenuItemForHeader('Item', 'Unhide All Columns', 'Freeze Category');
        await takeScreenshotByElement(
            vizPanelForGrid.getContainer('Freeze Category'),
            'TC99056_5_04',
            'Unhide Cost Trend by Region Columnset with threshold'
        );
    });

    it('[TC99056_6] Validate Hide column E2E user journey - Hide PIN Column', async () => {
        await resetDossierState({
            credentials: gridConstants.hideColumnUser,
            dossier: agGridPin,
        });
        await libraryPage.openDossier(agGridPin.name);
        await toc.openPageFromTocMenu({ chapterName: 'Header Setting', pageName: 'PinToLeft' });
        await agGridVisualization.openContextMenuItemForHeader(
            'Category',
            'Hide Column',
            'Pin a column and a microchart to left'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Pin a column and a microchart to left'),
            'TC99056_6_01',
            'Hide Pinned Column Category'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Cost Trend by Quarter',
            'Hide Column',
            'Pin a column and a microchart to left'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Pin a column and a microchart to left'),
            'TC99056_6_02',
            'Hide Pinned Microchart Cost Trend by Quarter'
        );
        await agGridVisualization.openContextMenuItemForHeader(
            'Cost Comparison by Quarter',
            'Unhide All Columns',
            'Pin a column and a microchart to left'
        );
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader('Pin a column and a microchart to left'),
            'TC99056_6_03',
            'Unhide Pinned Column and Microchart'
        );
    });
});
