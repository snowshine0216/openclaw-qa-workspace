import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('AGGrid_Drill_DDA', () => {
    const newTutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorial',
    };
    const agGridDrillDDA = {
        id: '064F1D79814C032AEEFAE8A62FB6B504',
        name: 'Auto_AGGrid_Drill_DDA',
        project: newTutorialProject,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, agGridVisualization, grid, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99058_1] Modern Grid Drill with DDA and microchart_consumption', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridDrillDDA,
        });
        await libraryPage.openDossier(agGridDrillDDA.name);
        // Drill is disabled if grid with DDA dataset has more than 1 column set
        await agGridVisualization.RMConColumnHeaderElement('Year', 'MultiColumnSets');
        await since('Drill should be disabled if grid with DDA dataset has more than 1 column set')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        // Drill is disabled if grid with DDA dataset has 1 microchart + 1 column set
        await agGridVisualization.RMConColumnHeaderElement('Year', 'Mixed');
        await since('Drill should be disabled if grid with DDA dataset has 1 microchart + 1 column set')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        // Drill is enabled if grid with DDA dataset has single column set
        await agGridVisualization.drillfromAttributeHeader('Category', 'Subcategory', 'SingleColumnSet');
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('SingleColumnSet'),
            'TC99058_1_01',
            'Drill in Modern Grid with DDA_single column set'
        );
        // Drill is enabled if grid with DDA dataset has single microchart
        await agGridVisualization.drillfromAttributeHeader('Year', 'Region', 'SingleMicrochart');
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('SingleMicrochart'),
            'TC99058_1_02',
            'Drill in Modern Grid with DDA_single microchart'
        );
    });

    it('[TC99058_2] Modern Grid Drill with DDA and microchart_authoring', async () => {
        await libraryPage.editDossierByUrl({
            projectId: agGridDrillDDA.project.id,
            dossierId: agGridDrillDDA.id,
        });
        // Drill is disabled if grid with DDA dataset has more than 1 column set
        await agGridVisualization.RMConColumnHeaderElement('Year', 'MultiColumnSets');
        await since('Drill should be disabled if grid with DDA dataset has more than 1 column set')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        // Drill is disabled if grid with DDA dataset has 1 microchart + 1 column set
        await agGridVisualization.RMConColumnHeaderElement('Year', 'Mixed');
        await since('Drill should be disabled if grid with DDA dataset has 1 microchart + 1 column set')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        // Drill is enabled if grid with DDA dataset has single column set
        await agGridVisualization.drillfromAttributeHeader('Category', 'Subcategory', 'SingleColumnSet');
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('SingleColumnSet'),
            'TC99058_2_01',
            'Drill in Modern Grid with DDA_single column set'
        );
        // Drill is enabled if grid with DDA dataset has single microchart
        await agGridVisualization.drillfromAttributeHeader('Year', 'Region', 'SingleMicrochart');
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('SingleMicrochart'),
            'TC99058_2_02',
            'Drill in Modern Grid with DDA_single microchart'
        );
    });
});
