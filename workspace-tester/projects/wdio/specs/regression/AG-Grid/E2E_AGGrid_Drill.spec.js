import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import * as gridConstants from '../../../constants/grid.js';
import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('E2E_AGGrid_Drill', () => {
    const newTutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorial',
    };
    const agGridDrill = {
        id: 'C4FC0761384A17400C4A35945D801AFA',
        name: 'Auto_AGGrid_DrillE2E',
        project: newTutorialProject,
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { loginPage, dossierPage, libraryPage, agGridVisualization, toc, grid, vizPanelForGrid } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(gridConstants.gridUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99057_1] Keep Formatting and Sort after drilling', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridDrill,
        });
        await libraryPage.openDossier(agGridDrill.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await agGridVisualization.drillfromAttributeHeader('Department', 'Employee Name', 'Visualization 1');
        await dossierPage.hidePageIndicator();
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC99057_1_01',
            'Keep Format and Sort after drilling'
        );
        await agGridVisualization.drillfromAttributeElement('Alagbe,Trina', 'Department', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC99057_1_02',
            'Drill from attribute element'
        );
        await agGridVisualization.RMConColumnHeaderElement('Hire Cost', 'Visualization 1');
        await since('Drill is disabled on Metric, Drill option should Not appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        await agGridVisualization.drillfromAttributeHeader('Female', 'Employee Name', 'Visualization 1');
        await takeScreenshotByElement(
            agGridVisualization.getContainer('Visualization 1'),
            'TC99057_1_03',
            'Drill from attribute in column set'
        );
        await agGridVisualization.RMConColumnHeaderElement('Hire Cost Trend by Date of Hire', 'Visualization 1');
        await since('Drill is disabled on Microchart, Drill option should Not appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
    });
    it('[TC99057_2] Disable drilling if grid contains Object Parameter', async () => {
        await resetDossierState({
            credentials: gridConstants.gridUser,
            dossier: agGridDrill,
        });
        await libraryPage.openDossier(agGridDrill.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'OP' });
        await agGridVisualization.RMConColumnHeaderElement('Applicant ID', 'GridWithOP');
        await since('Drill is disabled on OP, Drill option should Not appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        await agGridVisualization.RMConColumnHeaderElement('Department', 'GridWithOP');
        await since('Drill is disabled on OP, Drill option should Not appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
        await agGridVisualization.RMConColumnHeaderElement('Gender', 'GridWithOP');
        await since('Drill is disabled on normal attribute if grid contains OP, Drill option should Not appear')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Drill' }))
            .toBe(false);
    });
});
