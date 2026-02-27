import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('MDX Report Privilege', () => {
    let { loginPage, libraryPage, dossierCreator, reportPage, reportDatasetPanel, reportGridView } = browsers.pageObj1;
    const testUser = reportConstants.reportNoMDXPrivilegeUser;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-6540_01] Run MDX report without report filter', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6540_01_01',
            'with mdx privilege in the project'
        );
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate('blank');
        await dossierCreator.sleep(3000);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6540_01_02',
            'no mdx privilege in the project'
        );
    });

    it('[BCIN-6540_02] Run MDX report by user without define mdx report privilege', async () => {
        await libraryPage.openReportByUrl({
            documentId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Budget Variance %');
        await reportDatasetPanel.waitForStatusBarText('32 Rows, 2 Columns');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_01', 'MDX report grid view');
    });
});
