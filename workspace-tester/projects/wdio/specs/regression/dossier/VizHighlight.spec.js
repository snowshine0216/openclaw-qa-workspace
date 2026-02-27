import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';

describe('Viz highlight', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const dossier1 = {
        id: 'C0A44FF5461084D93FF0C99BF4B7DE9A',
        name: 'Enable highlight',
        project: tutorialProject,
    };

    const dossier2 = {
        id: '783C3AEF4C0139A9022431BD2AE295F5',
        name: 'Disable highlight',
        project: tutorialProject,
    };

    const browserWindow = {
        
        width: 1000,
        height: 800,
    };

    let { libraryPage, dossierPage, grid, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66400] Verify highlight is always disabled when hover on viz group in Library', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier1,
        });
        await libraryPage.openDossier(dossier1.name);

        // Fixed in DE166890. When enable highlight, hover on viz group, it should not be highlighted
        await dossierPage.hoverOnVizGroup();
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC66400', 'VizGroup', { tolerance: 0.2 });

        // When enable highlight, hover on individual viz, it is highlighted
        await grid.hoverOnGridElementNoWait({ title: 'Grouped viz1', headerName: 'Region', elementName: 'Central' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC66400', 'IndividualGroupHighlighted', {
            tolerance: 0.2,
        });
    });

    it('[TC66401] Verify "disable highlight" setting works for individual viz in Library', async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier: dossier2,
        });
        await libraryPage.openDossier(dossier2.name);

        // When disable highlight, hover on individual viz, it is not highlighted
        await grid.hoverOnGridElementNoWait({ title: 'Grouped viz1', headerName: 'Region', elementName: 'Central' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC66401', 'IndividualGroupNotHighlighted', {
            tolerance: 0.2,
        });
    });
});
