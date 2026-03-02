import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('E2E_AGGrid_IncrementalFetchTooltip', () => {
    const newTutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorial',
    };
    const E2E_AGGrid_IncrementalFetchTooltip = {
        id: '9E402049344FC4C5D8EB9BA5C02C56AC',
        name: 'Auto_Incremental Tooltip',
        project: newTutorialProject,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        dossierPage,
        libraryPage,
        agGridVisualization,
        contentsPanel,
        moreOptions,
        loadingDialog,
        dossierAuthoringPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC3156_1] Apply modern grid incremental fetch suggestion_Column set', async () => {
        await libraryPage.editDossierByUrl({
            projectId: E2E_AGGrid_IncrementalFetchTooltip.project.id,
            dossierId: E2E_AGGrid_IncrementalFetchTooltip.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Columnset' });
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.hoverIncrementalFetchHelpIcon();
        await takeScreenshotByElement(
            moreOptions.getMoreOptionsDialog(),
            'TC3156_1_1',
            'ModernGrid Incremental Fetch Tooltip',
        );
        await agGridVisualization.applyIncrementalFetchSuggestedValue();
        await agGridVisualization.saveAndCloseMoreOptionsDialog();
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await takeScreenshotByElement(
            moreOptions.getMoreOptionsDialog(),
            'TC3156_1_2',
            'ModernGrid Incremental Fetch Tooltip_suggested value applied',
        );
    });

    it('[TC3156_2] Apply modern grid incremental fetch suggestion_Microchart', async () => {
        await libraryPage.editDossierByUrl({
            projectId: E2E_AGGrid_IncrementalFetchTooltip.project.id,
            dossierId: E2E_AGGrid_IncrementalFetchTooltip.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Microchart' });
        await agGridVisualization.openMoreOptionsDialog('Visualization 2');
        await agGridVisualization.hoverIncrementalFetchHelpIcon();
        await takeScreenshotByElement(
            moreOptions.getMoreOptionsDialog(),
            'TC3156_2_1',
            'ModernGrid Incremental Fetch Tooltip_Microchart',
        );
        await agGridVisualization.applyIncrementalFetchSuggestedValue();
        await agGridVisualization.saveAndCloseMoreOptionsDialog();
        await agGridVisualization.openMoreOptionsDialog('Visualization 2');
        await takeScreenshotByElement(
            moreOptions.getMoreOptionsDialog(),
            'TC3156_2_2',
            'ModernGrid Incremental Fetch Tooltip_Microchart_suggested value applied',
        );
    });

    it('[TC3156_3] Apply modern grid incremental fetch suggestion_UndoRedo', async () => {
        await libraryPage.editDossierByUrl({
            projectId: E2E_AGGrid_IncrementalFetchTooltip.project.id,
            dossierId: E2E_AGGrid_IncrementalFetchTooltip.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Columnset' });
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await agGridVisualization.hoverIncrementalFetchHelpIcon();
        await agGridVisualization.applyIncrementalFetchSuggestedValue();
        await agGridVisualization.saveAndCloseMoreOptionsDialog();
        await dossierAuthoringPage.actionOnToolbar('Undo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await takeScreenshotByElement(moreOptions.getMoreOptionsDialog(), 'TC3156_3_1', 'Undo_apply suggested value');
        await agGridVisualization.cancelAndCloseMoreOptionsDialog();
        await dossierAuthoringPage.actionOnToolbar('Redo');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await agGridVisualization.openMoreOptionsDialog('Visualization 1');
        await takeScreenshotByElement(moreOptions.getMoreOptionsDialog(), 'TC3156_3_2', 'Redo_apply suggested value');
    });
});
