import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('New Dashboard Authoring Layout - Datasets/TOC panels', () => {
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const userCredential = {
        username: 'User_Portuguese',
        password: 'newman1#',
    };

    const { libraryPage, dossierAuthoringPage, dossierPage, loginPage } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(userCredential);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[BCED-2102] Check the styles of Datasets and TOC panel when the title text is too long', async () => {
        await libraryPage.createNewDashboardByUrl({
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        });
        await takeScreenshotByElement(
            await dossierAuthoringPage.datasetsPanel.getDatasetsPanel(),
            'BCED-2102',
            'DatasetsTocPanel_1'
        );
        // Enlarge the width of Datasets panel so the text should be fully displayed
        await dossierAuthoringPage.datasetsPanel.changePanelWidthByPixel(100);
        await takeScreenshotByElement(
            await dossierAuthoringPage.datasetsPanel.getDatasetsPanel(),
            'BCED-2102',
            'DatasetsTocPanel_2'
        );
    });
});
