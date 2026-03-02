import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import deleteObjectsUnderFolder from '../../../../api/objectManagement/delete-objects-by-folder.js';
import setTemplate from '../../../../api/objectManagement/setTemplate.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report Template Test', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        reportPage,
        reportGridView,
        promptEditor,
        advancedReportProperties,
        reportMenubar,
        reportToolbar,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportTemplateTestUser;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;
    const tempFolder = 'report_template';
    const templateWithPageBy = 'report template with page by';

    beforeAll(async () => {
        await loginPage.login(testUser);
        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await dossierCreator.resetLocalStorage();
        await libraryPage.openDefaultApp();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
    });

    it('[BCIN-3749_01] Create report by choosing blank template', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3749_01_01',
            'blank template as default'
        );
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_01_02', 'report page with blank template');
    });

    it('[BCIN-3749_02] Create report by choosing selected template', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithPageBy);
        await dossierCreator.selectTemplate(templateWithPageBy);
        await takeScreenshotByElement(dossierCreator.getCreateNewDossierPanel(), 'BCIN-3749_02_01', 'select template');
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        // wait for total profit to be $1,304,141
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_02_02', 'report page by selected template');
    });

    it('[BCIN-3749_03] Create report by choosing selected template with prompt', async () => {
        const templateWithPrompt = 'report template with prompt';
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithPrompt);
        await dossierCreator.selectTemplate(templateWithPrompt);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await since('1. Prompt editor should be open, instead prompt editor is not show')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptEditor.run();
        // wait for total revenue to be $35,023,708
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$35,023,708');
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_03_01', 'create by prompt template');
    });

    it('[BCIN-3749_04] Create report by choosing selected subset report template', async () => {
        const templateWithSubsetReport = 'report template subset';
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithSubsetReport);
        await dossierCreator.selectTemplate(templateWithSubsetReport);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$28,192');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('3 Rows, 3 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-3749_04_01',
            'report page by selected subset report template'
        );
    });

    it('[BCIN-3749_05] Create report by choosing selected report template with customized properties', async () => {
        const templateWithCustomizedProperties = 'report template customized properties';
        const incrementalFetchSetting = 'Incremental Fetch';
        const cachingSetting = 'Caching';
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithCustomizedProperties);
        await dossierCreator.selectTemplate(templateWithCustomizedProperties);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(15, 4, '$583,538');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('15 Rows, 3 Columns');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-3749_05_01',
            'report page by selected report template with customized properties'
        );
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(incrementalFetchSetting);
        await since('2. The report incremental fetch setting should be by default #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(incrementalFetchSetting))
            .toBe('Enable');
        await since(
            '3. The report incremental fetch row per page should be by default #{expected}, while we got #{actual}'
        )
            .expect(await advancedReportProperties.getPropertySettingDetailsByName('Rows per Page'))
            .toBe('500');
        await advancedReportProperties.clearSearchBox();
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await since('4. The report caching setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(cachingSetting))
            .toBe('Disable');
        await advancedReportProperties.selectReportPropertyType('Drilling');
        await takeScreenshotByElement(
            advancedReportProperties.getReportPropertiesDialog(),
            'BCIN-3749_05_02',
            'disable report drilling'
        );
    });

    it('[BCIN-3749_06] Create report by choosing certified report template', async () => {
        const certifiedTemplate = 'report template certified';
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(certifiedTemplate);
        await dossierCreator.selectTemplate(certifiedTemplate);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$196,301');
        await since('1. Total row count should be #{expected}, instead we have #{actual}')
            .expect(await reportDatasetPanel.StatusBar.getText())
            .toBe('24 Rows, 2 Columns');
        await since('2. Certified icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getCertifiedIcon().isDisplayed())
            .toBe(false);
        await since('3. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(false);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-3749_06_01',
            'report page by selected certified report template'
        );
        await since('4. Report title should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getReportTitle().getText())
            .toBe(certifiedTemplate);
        await since('5. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Set as Template'))
            .toBe(false);
    });

    it('[BCIN-3749_07] Create report by choosing blank report template', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_07_01', 'select blank template');
    });

    it('[BCIN-3749_08] Create report by choosing blank button', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.clickBlankDossierBtn();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_08_01', 'create report by blank button');
        await since('1. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Set as Template'))
            .toBe(false);
    });

    it('[BCIN-3749_09] Save report as template in save as dialog', async () => {
        await deleteObjectsUnderFolder({
            credentials: testUser,
            folderId: '32157318B1489278BC4B4AAAC8852BCB', // MicroStrategy Tutorial > Public Objects > Reports > tmp > report_template
            projectId: tutorialProject.id,
            type: 3,
        });
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(templateWithPageBy);
        await dossierCreator.selectTemplate(templateWithPageBy);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141');
        await reportMenubar.clickSubMenuItem('File', 'Save');
        await reportPage.saveAsDialog.browseFolderInSaveAsDialog(tempFolder);
        await reportPage.saveAsDialog.changeSetAsTemplateCheckBoxInSaveAsDialog();
        await reportPage.saveAsDialog.clickSaveButtonInSaveAsDialog();
        await reportPage.saveAsDialog.waitForSaving();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 4, '$1,304,141');
        await since('1. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-3749_09_01', 'save report by set template');
    });

    it('[BCIN-3749_10] Set as template from menubar without change', async () => {
        await setTemplate({
            credentials: reportConstants.mstrUser,
            object: reportConstants.TemplateProductReport,
            isTemplate: false,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await since('1. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(false);
        await since('2. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Set as Template'))
            .toBe(true);
        await reportMenubar.clickMenuItem('File');
        await reportMenubar.clickSubMenuItem('File', 'Set as Template');
        await reportPage.waitForReportLoading(true);
        await since('3. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await since('4. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
        await since('5. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Unset as Template'))
            .toBe(true);
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(reportConstants.TemplateProductReport.name);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3749_10_01',
            'new report by set template from menubar'
        );
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportMenubar.clickSubMenuItem('File', 'Unset as Template');
        await reportPage.waitForReportLoading(true);
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(reportConstants.TemplateProductReport.name);
        await takeScreenshotByElement(dossierCreator.getCreateNewDossierPanel(), 'BCIN-3749_10_02', 'empty view');
    });

    it('[BCIN-3749_11] Set as template from menubar with manipulation on report', async () => {
        await setTemplate({
            credentials: reportConstants.mstrUser,
            object: reportConstants.TemplateProductReport,
            isTemplate: false,
        });
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportToolbar.actionOnToolbar('resume');
        await since('1. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(false);
        await since('2. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Set as Template'))
            .toBe(true);
        await reportMenubar.clickMenuItem('File');
        await reportMenubar.clickSubMenuItem('File', 'Set as Template');
        await reportPage.cancelInConfirmDialog();
        await since('3. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(false);
        await reportMenubar.clickSubMenuItem('File', 'Set as Template');
        await since('4. The confirm button should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getConfirmButtonInAutoSaveDialog().getText())
            .toBe('Save and Set');
        await reportPage.confirmToSaveAndSetTemplate();
        await since('5. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await since('6. Template icon on report title bar should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getTemplateIcon().isDisplayed())
            .toBe(true);
        await since('7. Set as template should not show in menubar when creating new report, instead it shows')
            .expect(await reportMenubar.isSubMenuItemVisible('File', 'Unset as Template'))
            .toBe(true);
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(reportConstants.TemplateProductReport.name);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-3749_10_01',
            'new report by set template from menubar'
        );
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.TemplateProductReport.id,
            projectId: reportConstants.TemplateProductReport.project.id,
        });
        await reportToolbar.actionOnToolbar('resume');
        await reportMenubar.clickSubMenuItem('File', 'Unset as Template');
        await since('8. The confirm button should be #{expected}, instead we have #{actual}')
            .expect(await reportPage.getConfirmButtonInAutoSaveDialog().getText())
            .toBe('Save and Unset');
        await reportPage.confirmToSaveAndSetTemplate();
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.searchTemplate(reportConstants.TemplateProductReport.name);
        await takeScreenshotByElement(dossierCreator.getCreateNewDossierPanel(), 'BCIN-3749_10_02', 'empty view');
    });
});
