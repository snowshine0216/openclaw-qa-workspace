import * as gridConstants from '../../../constants/grid.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';
import resetDossierState from '../../../api/resetDossierState.js';

describe('Sanity_AGGrid_HideColumnConsumption', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, libraryPage, agGridVisualization } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    it('[TC99056_01] sanity test on single xtab grid', async () => {
        const gridName = 'Visualization 2';

        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGridHideColumnBasicXtab,
        });

        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridHideColumnBasicXtab.project.id,
            dossierId: gridConstants.AGGridHideColumnBasicXtab.id,
        });

        // hide attribute in row drop zone
        await agGridVisualization.openContextMenuItemForHeader('Quarter', 'Hide Column', gridName);
        await takeScreenshotByElement(agGridVisualization.agGridHeader(gridName), 'TC99056_01_01', `hide quarter`);

        // hide attribute element in column drop zone
        await agGridVisualization.openContextMenuItemForHeader('Northeast', 'Hide Column', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_01_02',
            'hide quarter and northeast'
        );

        // unhide all columns by header context menu
        await agGridVisualization.openContextMenuItemForHeader('Country', 'Unhide All Columns', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_01_03',
            'unhide all columns by header context menu'
        );

        // hide metric in column drop zone
        await agGridVisualization.openContextMenuItemForHeader('Cost', 'Hide Column', gridName);
        await takeScreenshotByElement(agGridVisualization.agGridHeader(gridName), 'TC99056_01_04', 'hide cost');

        // unhide all columns by container context menu
        await agGridVisualization.openContextMenu(gridName);
        await agGridVisualization.selectContextMenuOption('Unhide All Columns');
        await takeScreenshotByElement(agGridVisualization.agGridHeader(gridName), 'TC99056_01_05', 'unhide all columns by container context menu');
    });

    it('[TC99056_02] sanity test on multi xtab grid', async () => {
        const gridName = 'Visualization 2';

        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: gridConstants.AGGridHideColumnBasicMultiXtab,
        });

        await libraryPage.openDossierById({
            projectId: gridConstants.AGGridHideColumnBasicMultiXtab.project.id,
            dossierId: gridConstants.AGGridHideColumnBasicMultiXtab.id,
        });

        // hide column in 1 layer column set
        await agGridVisualization.openContextMenuItemForHeader('Profit', 'Hide Column', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_01',
            'hide column in 1 layer column set'
        );

        // hide column in 2 layer column set
        await agGridVisualization.openContextMenuItemForHeader('Southeast', 'Hide Column', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_02',
            'hide column in 2 layer column set'
        );

        // unhide all columns by header context menu
        await agGridVisualization.openContextMenuItemForHeader('Category', 'Unhide All Columns', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_03',
            'unhide all columns by header context menu'
        );

        // hide microchart in 1 layer microchart
        await agGridVisualization.openContextMenuItemForHeader('Unit Cost Trend by Month', 'Hide Column', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_04',
            'hide microchart in 1 layer microchart'
        );

        // hide microchart in 2 layer microchart
        await agGridVisualization.openContextMenuItemForHeader('Profit Comparison by Quarter', 'Hide Column', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_05',
            'hide microchart in 2 layer microchart'
        );

        // unhide all columns by header context menu
        await agGridVisualization.openContextMenuItemForHeader('Category', 'Unhide All Columns', gridName);
        await takeScreenshotByElement(
            agGridVisualization.agGridHeader(gridName),
            'TC99056_02_06',
            'unhide all columns by header context menu'
        );
    });
});
