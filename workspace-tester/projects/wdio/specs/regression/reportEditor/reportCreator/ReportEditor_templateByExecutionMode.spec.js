import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { executeOnSlowNetwork, ThrottleMode } from '../../../../api/mock/mock-network-throttle.js';

describe('Report Template by Execution Mode', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        dossierPage,
        reportPage,
        reportGridView,
        reportToolbar,
        reportTOC,
        reportDatasetPanel,
        reportFilterPanel,
        reportEditorPanel,
        promptEditor,
        aePrompt,
        promptObject,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportTemplateTestUser;
    const tutorialProject = reportConstants.tutorialProject;
    const hierarchiesProject = reportConstants.hierarchiesProject;
    const reportTemplateWithObjectPrompt = reportConstants.reportTemplateWithObjectPrompt;
    const bigReportTemplateWithPrompt = reportConstants.bigReportTemplateWithPrompt;
    const attributePromptTitle = 'Attribute objects';
    const metricPromptTitle = 'Metric objects';

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

    it('[BCIN-7306_01] Default view mode is Data Retrieval Mode', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('1. Default view mode should be #{expected}, instead it is #{actual}')
            .expect(await dossierCreator.getViewModeSelector().getText())
            .toBe('Data Pause Mode');
        await dossierCreator.closeNewDossierPanel();
    });

    it('[BCIN-7306_02] Create report by pause mode', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await since(`1. The report should be in pause mode, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
    });

    it('[BCIN-7306_03] Create report by data retrieval mode', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectExecutionMode();
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 3, '$480,173');
        await since(`1. Grid cell should be #{expected}, instead the cell value is #{actual}`)
            .expect(await reportGridView.getGridCellText(1, 0))
            .toBe('Books');
        await since(`2. The report should be in pause mode, instead we have #{actual}`)
            .expect(await reportPage.isInPauseMode())
            .toBe(false);
    });

    it('[BCIN-7306_04] Create report by template with object prompt in pause mode', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await since('1. The prompt editor should be opened, instead it is not shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Subcategory');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Profit');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await since('2. The report should be in pause mode, instead we have #{actual}')
            .expect(await reportPage.isInPauseMode())
            .toBe(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Books');
        await since('3. The report cell on (1,3) should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$110,012');
    });

    it('[BCIN-7306_05] Create report by template with object prompt in data retrieval mode', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectExecutionMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await since('1. The prompt editor should be opened, instead it is not shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Subcategory');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Profit');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Books');
        await since('2. The report should be in pause mode, instead we have #{actual}')
            .expect(await reportPage.isInPauseMode())
            .toBe(false);
        await since('3. The report cell on (1,3) should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$110,012');
    });

    it('[BCIN-7306_06] Create report by template in pause mode and cancel', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(bigReportTemplateWithPrompt.name);
        await dossierCreator.selectTemplate(bigReportTemplateWithPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptEditor.cancelEditor();
        await since('1. The prompt editor should be closed after cancel, instead it is still shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await since('2. It should go back to library home after cancel, instead it is still in report page')
            .expect(await libraryPage.getTitleText())
            .toBe('Library');
    });

    it('[BCIN-7306_07] Create report by template in pause mode and cancel during apply prompt', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(bigReportTemplateWithPrompt.name);
        await dossierCreator.selectTemplate(bigReportTemplateWithPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptObject.selectPromptByIndex({ index: '1', promptName: 'Year' });
        const attrPromptYear = await promptObject.getPromptByName('Year');
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPromptYear, '2020');
        await aePrompt.shoppingCart.addSingle(attrPromptYear);
        const attrPromptCategory = await promptObject.getPromptByName('Category');
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPromptCategory, 'Books');
        await aePrompt.shoppingCart.addSingle(attrPromptCategory);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPromptCategory, 'Movies');
        await aePrompt.shoppingCart.addSingle(attrPromptCategory);
        await executeOnSlowNetwork(async () => {
            await promptEditor.runNoWait();
            await dossierPage.clickCancelExecutionButton();
        }, ThrottleMode.Regular2G);
        await promptEditor.waitForPromptLoading();
        await since('1. The prompt editor should show after cancel apply prompt, instead it is not shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        await takeScreenshotByElement(
            promptEditor.getPromptContainer(),
            'BCIN7306_07_01',
            'Prompt editor with selected prompt answers'
        );
        await promptEditor.cancelEditor();
    });

    it('[BCIN-7306_08] Create report by template with object prompt in pause mode and update template objects', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.searchObject('Month');
        await reportDatasetPanel.objectBrowser.clickFilterByCategory({ name: 'Attribute' });
        await reportDatasetPanel.objectBrowser.sleep(1000);
        await reportDatasetPanel.addObjectToRows('Month');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, 'Jan 2020');
        await since('1. The report cell on (1,2) should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('$28,271');
    });

    it('[BCIN-7306_09] Create report by template with object prompt in pause mode and apply filters', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await reportTOC.switchToFilterPanel();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Year', 'report filter');
        await reportFilterPanel.selectElements(['2020', '2021']);
        await reportFilterPanel.newQual.done();
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Books');
        await since('The report cell on (1,1) should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$1,191,419');
    });

    it('[BCIN-7306_10] Create report by template with object prompt in pause mode and add another prompt', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await reportTOC.switchToFilterPanel();
        await reportFilterPanel.openNewReportFiltersPanel();
        await reportFilterPanel.newQual.waitForObjectSearchDropdown();
        await reportFilterPanel.newQual.searchBasedOn('Call Center');
        await reportFilterPanel.newQual.clickBasedOnCategory('Attribute');
        await reportFilterPanel.newQual.selectBasedOnObject('Call Center');
        await reportFilterPanel.newQual.clickCreateEmbeddedPrompt();
        await reportPage.embedPromptEditor.waitForLoading();
        await reportPage.embedPromptEditor.clickDoneButton();
        await since('1. The prompt editor should not open, instead it is shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(false);
        await reportToolbar.switchToDesignMode(true);
        await since('2. The prompt editor should open after switching to design mode, instead it is not shown')
            .expect(await promptEditor.isEditorOpen())
            .toBe(true);
        const attrPromptOfCallCenter = await promptObject.getPromptByName('Call Center');
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPromptOfCallCenter, 'Atlanta');
        await aePrompt.shoppingCart.addSingle(attrPromptOfCallCenter);
        await promptEditor.run();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 0, 'Books');
        await since('3. The report cell on (1,1) should be #{expected}, instead it is #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$63,230');
    });

    it('[BCIN-7306_11] Create report by template with object prompt in pause mode and undo redo', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectPauseMode();
        await dossierCreator.searchTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.selectTemplate(reportTemplateWithObjectPrompt.name);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await promptEditor.waitForPromptLoading();
        await promptObject.selectPromptByIndex({ index: '1', promptName: attributePromptTitle });
        const attrPrompt = await promptObject.getPromptByName(attributePromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(attrPrompt, 'Category');
        await aePrompt.shoppingCart.addSingle(attrPrompt);
        const metricPrompt = await promptObject.getPromptByName(metricPromptTitle);
        await aePrompt.shoppingCart.clickElmInAvailableList(metricPrompt, 'Cost');
        await aePrompt.shoppingCart.addSingle(metricPrompt);
        await promptEditor.run();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportEditorPanel.removeAttributeInRowsDropZone('Category');
        await reportToolbar.clickUndo(true);
        await reportDatasetPanel.clickToCloseContextMenu();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN7306_11_01',
            'Report after undo removing Category from report'
        );
    });
});
