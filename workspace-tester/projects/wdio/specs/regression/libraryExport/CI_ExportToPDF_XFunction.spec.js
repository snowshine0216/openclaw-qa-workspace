import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Library Authoring - Manipulations related to PDF export', () => {
    const dossier = {
        id: '112ACEDAE0425D9F66C8B98A23BC71D0',
        name: '(AUTO) Export PDF - Dynamic Text',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1000,
    };

    let {
        loginPage,
        dossierAuthoringPage,
        libraryPage,
        datasetPanel,
        libraryAuthoringPage,
        libraryAuthoringPDFExport,
        loadingDialog,
    } = browsers.pageObj1;
    let mockedPdfRequest;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login({ username: 'nee_auto', password: '' });
        await loginPage.enableABAlocator();
        mockedPdfRequest = await browser.mock('https://**/pdf');
    });

    beforeEach(async () => {
        mockedPdfRequest.clear();
        await resetDossierState({
            credentials: { username: 'nee_auto', password: '' },
            dossier: dossier,
        });
    });

    it('[BCVE-5272_01] In pause mode, check PDF export options: Dashboard Properties -> Advanced Mode', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        await libraryAuthoringPDFExport.clickReactAdvanceMode();
        await libraryAuthoringPDFExport.sleep();
        const exportPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(exportPreview, 'BCVE-5272_01', 'AdvancedMode_CustomizedHeaderFooter', {
            tolerance: 0.3,
        });
    });

    it('[BCVE-5272_02] Remove dataset, check PDF export options: Dashboard Properties -> Advanced Mode', async () => {
        await libraryPage.editDossierByUrl({
            projectId: dossier.project.id,
            dossierId: dossier.id,
        });
        await datasetPanel.deleteDataset('BasicDataset');
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await libraryAuthoringPage.openFileMenu();
        await libraryAuthoringPage.openDashboardPropertiesMenu();
        await libraryAuthoringPage.clickExportToPDFTab();
        await libraryAuthoringPDFExport.clickReactAdvanceMode();
        await libraryAuthoringPDFExport.sleep();
        const exportPreview = libraryAuthoringPDFExport.getExportPreview();
        await takeScreenshotByElement(exportPreview, 'BCVE-5272_02', 'AdvancedMode_CustomizedHeaderFooter', {
            tolerance: 0.3,
        });
    });
});
