import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';

describe('E2E_AGGrid_TextWrap', () => {
    const newTutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorial',
    };
    const agGridWrap = {
        id: '9CB8FB2B8D427BE8AE81E2AAFC52EE0C',
        name: 'Auto_AGGrid_TextWrap',
        project: newTutorialProject,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, agGridVisualization, toc, inCanvasSelector } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99325_1] Enable Wrap for Entire Grid', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridWrap,
        });
        await libraryPage.openDossier(agGridWrap.name);
        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'Wrap Entire Grid' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC99325_1',
            'Wrap Entire Grid for different type of elements'
        );
    });

    it('[TC99325_2] Enable Wrap for Row Header and Column Headers', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridWrap,
        });
        await libraryPage.openDossier(agGridWrap.name);
        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'Only Wrap Header' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 2'),
            'TC99325_2',
            'Wrap Column headers and Row headers'
        );
    });

    it('[TC99325_3] Wrap is kept after manipulations', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridWrap,
        });
        await libraryPage.openDossier(agGridWrap.name);
        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'Manipulations' });
        await agGridVisualization.openContextMenuItemForHeader('Derived Attribute', 'Hide Column', 'Visualization 3');
        await dossierPage.hidePageIndicator();
        await agGridVisualization.sleep(2000);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 3'),
            'TC99325_3_01',
            'Wrap is kept after hiding a column'
        );
        await inCanvasSelector.selectItem('Chinese Test');
        await dossierPage.hidePageIndicator();
        await agGridVisualization.sleep(2000);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 3'),
            'TC99325_3_02',
            'Wrap is kept after changing selection in Attribute selector'
        );
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Chinese Test',
            'Drill',
            'German Test',
            'Visualization 3'
        );
        await dossierPage.hidePageIndicator();
        await agGridVisualization.sleep(2000);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 3'),
            'TC99325_3_03',
            'Wrap is kept after drilling'
        );
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Final Column',
            'Sort All Values (Default)',
            null,
            'Visualization 3'
        );
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 3'),
            'TC99325_3_04',
            'Wrap is kept after sorting'
        );
        await agGridVisualization.openContextSubMenuItemForHeader(
            'Mixed Content',
            'Pin Column',
            'to the Left',
            'Visualization 3'
        );
        await dossierPage.hidePageIndicator();
        await agGridVisualization.sleep(2000);
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 3'),
            'TC99325_3_05',
            'Wrap is kept after Pin Column'
        );
    });

    it('[TC99325_4] Verify Wrap for x-tab grid with microchart', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridWrap,
        });
        await libraryPage.openDossier(agGridWrap.name);
        await toc.openPageFromTocMenu({ chapterName: 'Wrap', pageName: 'X-tab' });
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 4'),
            'TC99325_4',
            'Wrap for x-tab grid with microchart'
        );
    });
});
