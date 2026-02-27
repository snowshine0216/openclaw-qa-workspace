import { exportSnapshotUser } from '../../../constants/bot.js';
import { checkElementByImageComparison } from '../../../utils/TakeScreenshot.ts';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { waitForFileExists, deleteFile } from '../../../utils/compareImage.js';
import authoringPage from '../../../pageObjects/library/authoring/library.authoring.page.js'
import path from 'path';
import { info } from 'console';
//export const downloadDirectory = (() => path.join(process.cwd(), 'downloads'))();
import '../../../utils/toMatchPdf.ts';
import { subscribe } from 'diagnostics_channel';
import { dossier } from '../../../constants/teams.js';
const downloadDirectory = 'downloads';

describe('ABA Export Subscription Snapshot to PDF', () => {
    let { loginPage, libraryPage, share, dossierPage, pdfExportWindow, toc, libraryAuthoringPage, libraryAuthoringPDFExport, autoDashboard, infoWindow, baseVisualization, subscribe, sidebar } = browsers.pageObj1;
    
    const dossier_testSubscriptionSnapshot = {
        id: '0EBEDB26458E059F842D0C9063E5BB87',
        name: 'testSubscriptionSnapshot',
        snapshot: 'testSnapshotExport',
        project: {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
        },
    };

    beforeAll(async () => {
        await browser.setWindowSize(1600, 1200);
        await loginPage.login(exportSnapshotUser);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98981_1] Open Subscription Snapshot and Export to PDF from Share Menu', async () => {
        await libraryPage.clickLibraryIcon();
        await sidebar.openSubscriptions();
        await dossierPage.sleep(subscribe.DEFAULT_API_TIMEOUT);//wait for subscription api returned
        await subscribe.clickRunNowInSubscriptionListByName('testSnapshotExport');
        await dossierPage.sleep(3000);
        await sidebar.openAllSectionList();
        await libraryPage.clickLibraryIcon();
        await libraryPage.moveDossierIntoViewPort(dossier_testSubscriptionSnapshot.name);
        await libraryPage.openDossierInfoWindow(dossier_testSubscriptionSnapshot.name);
        await subscribe.openSubscriptionSnapshotByName(dossier_testSubscriptionSnapshot.snapshot);
        await dossierPage.waitForDossierLoading();
        await share.openSharePanel();
        await share.openExportPDFSettingsWindow();
        await pdfExportWindow.clickMoreSettings();
        await checkElementByImageComparison(
            pdfExportWindow.getDossierExportPDFPanel(),
            'T4969/export/pdf',
            'TC98981_1-Share_CheckSnapshotPDFSettings_default',
            1
        );
        await deleteFile({name: dossier_testSubscriptionSnapshot.name,fileType:'.pdf'});
        await pdfExportWindow.exportSubmitLibrary();
        const filepath = path.join(downloadDirectory, `${dossier_testSubscriptionSnapshot.name}.pdf`);
        await waitForFileExists(filepath, 50000);
        await dossierPage.sleep(1000);
        const baselineDirectory_shareMenu = 'resources/TC98981_1/shareMenu';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_shareMenu, `${dossier_testSubscriptionSnapshot.name}.pdf`));
        await dossierPage.goToLibrary(); 
    });

    it('[TC98981_2] Open Subscription Snapshot and Export to PDF from Visualization Menu', async () => {
        await deleteFile({name: dossier_testSubscriptionSnapshot.name,fileType:'.pdf'});
        await libraryPage.moveDossierIntoViewPort(dossier_testSubscriptionSnapshot.name);
        await libraryPage.openDossierInfoWindow(dossier_testSubscriptionSnapshot.name);
        await subscribe.openSubscriptionSnapshotByName(dossier_testSubscriptionSnapshot.snapshot);
        await dossierPage.waitForDossierLoading();
        await pdfExportWindow.selectExportToPDFOnVisualizationMenu('Ring');
        await dossierPage.sleep(1000);
        await checkElementByImageComparison(
            pdfExportWindow.getMojoPDFExportSettingsEditor(),
            'T4969/export/pdf',
            'TC98981_2-VizMenu_CheckPDFExportSettings_default',
            1
        );
        await pdfExportWindow.exportSubmitVisualization();
        await dossierPage.sleep(1000);
        const filepath = path.join(downloadDirectory, `${dossier_testSubscriptionSnapshot.name}.pdf`);
        await waitForFileExists(filepath, 30000);
        const baselineDirectory_vizMenu = 'resources/TC98981_2/vizMenu';
        await expect(filepath).toMatchPdf(path.join(baselineDirectory_vizMenu, `${dossier_testSubscriptionSnapshot.name}.pdf`));
        await dossierPage.goToLibrary(); 
    });

});