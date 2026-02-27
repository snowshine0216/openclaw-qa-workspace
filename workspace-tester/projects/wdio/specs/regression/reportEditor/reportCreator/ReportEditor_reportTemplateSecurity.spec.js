import * as reportConstants from '../../../../constants/report.js';
import { simpleReport } from '../../../../constants/customApp/info.js';
import { templateMessage } from '../../../../constants/template.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report Creator Security Test', () => {
    let { loginPage, libraryPage, dossierCreator, reportPage, reportMenubar } = browsers.pageObj1;
    const tutorialProject = reportConstants.tutorialProject;
    const templateWithPageBy = 'report template with page by';

    beforeAll(async () => {
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await libraryPage.openDefaultApp();
    });

    afterEach(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-3844_01] Show report template when having execute ACL', async () => {
        await loginPage.login(reportConstants.reportTemplateNoExecuteAclUser);
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(templateWithPageBy);
        await since(
            '1. No result warning should be displayed in card view, instead template without execute acl are shown'
        )
            .expect(await dossierCreator.getNoResultWarning().isDisplayed())
            .toBe(true);
        await dossierCreator.switchToListView();
        await since(
            '2. No result warning should be displayed in list view, instead template without execute acl are shown'
        )
            .expect(await dossierCreator.getNoResultWarning().isDisplayed())
            .toBe(true);
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await loginPage.login(reportConstants.reportTemplateTestUser);
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(templateWithPageBy);
        await since('3. No result warning should not display, instead it is shown')
            .expect(await dossierCreator.getNoResultWarning().isDisplayed())
            .toBe(false);
    });

    it('[BCIN-3844_02] No write acl to report', async () => {
        await loginPage.login(reportConstants.reportTemplateTestUser);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReportAcl.id,
            projectId: reportConstants.TemplateProductReportAcl.project.id,
        });
        await reportMenubar.clickMenuItem('File');
        await takeScreenshotByElement(
            reportMenubar.getActiveMenuDropdown(),
            'BCIN-3844_02_01',
            'Disable set as template when no write acl to report'
        );
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await loginPage.login(reportConstants.reportTemplateNoExecuteAclUser);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateReportCertified.id,
            projectId: reportConstants.TemplateReportCertified.project.id,
        });
        await reportMenubar.clickMenuItem('File');
        await takeScreenshotByElement(
            reportMenubar.getActiveMenuDropdown(),
            'BCIN-3844_02_02',
            'Disable unset as template when no write acl to report'
        );
    });

    it('[BCIN-3844_03] No set template privilege', async () => {
        await loginPage.login(reportConstants.reportTemplateNoPrivilegeUser);
        await dossierCreator.createNewReport();
        // user has set template privilege for Tutorial project
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(reportConstants.TemplateReportCertified.name);
        await dossierCreator.selectTemplate(reportConstants.TemplateReportCertified.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportMenubar.clickSubMenuItem('File', 'Save');
        await reportMenubar.waitForElementVisible(reportPage.saveAsDialog.getSaveAsEditor());
        await since('1. Set as template checkbox should be displayed in save as dialog, instead it is shown')
            .expect(await reportPage.saveAsDialog.getSetAsTemplateCheckboxOnSaveAsEditor().isDisplayed())
            .toBe(true);

        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateReportCertified.id,
            projectId: reportConstants.TemplateReportCertified.project.id,
        });
        await reportMenubar.clickMenuItem('File');
        await takeScreenshotByElement(
            reportMenubar.getActiveMenuDropdown(),
            'BCIN-3844_03_01',
            'Enable unset as template when having privilege'
        );

        // edit report directly under project without set template privilege
        await libraryPage.editReportByUrl({
            dossierId: '3FEBB0657B4FF1CD6AA75CBE8387437B', // campaignTargetReport under Hierarchies Project
            projectId: 'B3FEE61A11E696C8BD0F0080EFC58F44',
        });
        await reportMenubar.clickMenuItem('File');
        await takeScreenshotByElement(
            reportMenubar.getActiveMenuDropdown(),
            'BCIN-3844_03_02',
            'Disable set as template when no set template privilege'
        );
        await reportMenubar.clickMenuItem('File');
        await reportMenubar.clickSubMenuItem('File', 'Save As...');
        await reportMenubar.waitForElementVisible(reportPage.saveAsDialog.getSaveAsEditor());
        await since('2. Set as template checkbox should be displayed in save as dialog, instead it is shown')
            .expect(await reportPage.saveAsDialog.getSetAsTemplateCheckboxOnSaveAsEditor().isDisplayed())
            .toBe(false);
    });

    it('[BCIN-3844_04] unset default customized template', async () => {
        await loginPage.login(reportConstants.mstrUser);
        await libraryPage.editReportByUrl({
            dossierId: simpleReport.id,
            projectId: simpleReport.project.id,
        });
        await reportMenubar.clickSubMenuItem('File', 'Unset as Template');
        await reportPage.waitForElementVisible(reportPage.getConfirmDialog());
        await since('1. The warning message should be #{expected}, instead we have #{actual}.')
            .expect(await reportPage.getConfirmMessage().getText())
            .toBe(
                'This report is configured as the default template in "MicroStrategy Tutorial" project. By unsetting as template, the default template will be removed for this project.'
            );
        await reportPage.cancelInConfirmDialog();
        await since(
            '2. After cancel unset default template, the template icon should be displayed in title bar, instead we have #{actual}.'
        )
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
    });
});
