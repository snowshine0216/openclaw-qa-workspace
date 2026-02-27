import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('MDX Report Creator Test', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        reportPage,
        reportToolbar,
        reportDatasetPanel,
        reportGridView,
        reportMenubar,
        advancedReportProperties,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportMDXTestUser;
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

    it('[BCIN-6511_01] Choose MDX cube in MDX report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_01_01',
            'MDX source default view'
        );
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_01_02',
            'enable create button after selecting MDX cube'
        );
    });

    it('[BCIN-6511_02] Check tree browser in MDX report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await since('1. Root folder should be #{expected}, instead it is #{actual}')
            .expect(await dossierCreator.mdxSourceSelector.getCurrentSelectedFolder())
            .toBe('MDX Data Sources');
        await dossierCreator.mdxSourceSelector.openFolderBrowserPopover();
        await dossierCreator.mdxSourceSelector.hoverOnCurrentFolderSelector();
        await since('2. Tooltip should show be #{expected}, instead it is #{actual}')
            .expect(await dossierCreator.mdxSourceSelector.getTooltipText())
            .toBe('MDX Data Sources');
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_02_01',
            'MDX source browser tree view'
        );
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserPopover(['Data Explorer - .DDSET_MDX']);
        await dossierCreator.mdxSourceSelector.openFolderBrowserPopover();
        await takeScreenshotByElement(
            dossierCreator.mdxSourceSelector.getFolderBrowserTreePopover(),
            'BCIN-6511_02_02',
            'MDX catalog as leaf node in tree view'
        );
    });

    it('[BCIN-6511_03] Search MDX cube in report creator', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView(['Data Explorer - TSSAP73']);
        await dossierCreator.mdxSourceSelector.searchObject('$INFOCUBE');
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_03_01',
            'Search MDX catalog'
        );
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView(['$INFOCUBE']);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_03_02',
            'clear search after navigation'
        );
        await dossierCreator.mdxSourceSelector.searchObject('Employee Sales');
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView(['Employee Sales']);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_03_03',
            'select MDX cube after search'
        );
        await dossierCreator.mdxSourceSelector.clearSearchBox();
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_03_04',
            'clear search will remove selection'
        );
    });

    it('[BCIN-6511_04] Show no content when no result after search', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView(['Data Explorer - TSSAP73']);
        await dossierCreator.mdxSourceSelector.searchObject('NonExist', { isValid: false });
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_04_01',
            'no content view after search with no result'
        );
    });

    it('[BCIN-6511_05] Open tree selector when choosing mdx cube', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await since('1. Create button should be disable by default in MDX source tab, instead it is enabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            'AV_TUTO',
            'Query_HierarchyNode_2_variables',
        ]);
        await since('2. Create button should be enabled after selecting MDX cube, instead it is disabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(true);
        await dossierCreator.mdxSourceSelector.openFolderBrowserPopover();
        await takeScreenshotByElement(
            dossierCreator.mdxSourceSelector.getFolderBrowserTreePopover(),
            'BCIN-6511_05_01',
            'open tree selector when choose MDX cube'
        );
    });

    it('[BCIN-6511_06] Switch project when choosing mdx cube', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            'AV_TUTO',
            'Query_HierarchyNode_2_variables',
        ]);
        await dossierCreator.switchProjectByName(hierarchiesProject.name);
        await since('1. Confirm switch project popup should be displayed, instead it is not displayed')
            .expect(await dossierCreator.isConfirmSwitchProjectPopupDisplayed())
            .toBe(true);
        await takeScreenshotByElement(
            dossierCreator.getConfirmSwitchProjectPopup(),
            'BCIN-6511_06_01',
            'confirm switch project popup'
        );
        await dossierCreator.confirmSwitchProject();
        await dossierCreator.mdxSourceSelector.waitForLoading();
        await since('2. Create button should be disabled after switching project, instead it is enabled')
            .expect(await dossierCreator.isCreateButtonEnabled())
            .toBe(false);
        await takeScreenshotByElement(
            dossierCreator.getCreateNewDossierPanel(),
            'BCIN-6511_06_02',
            'MDX source after switching project'
        );
    });

    it('[BCIN-6511_07] Choosing mdx cube and switch to template tab to create report', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.selectTemplate('Blank');
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_07_01', 'created by blank report template');
        await libraryPage.openDefaultApp();
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await dossierCreator.switchToTemplateTab();
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_07_02', 'created by default template');
    });

    it('[BCIN-6511_08] Create MDX report by hierarchy and metric on selected cube', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportPage.sleep(1000);
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_08_01', 'MDX report grid view');
        await reportDatasetPanel.objectBrowser.clickFilterByCategory({ name: 'Hierarchy (4)' });
        await reportDatasetPanel.addObjectToRows('Country');
        await reportDatasetPanel.addObjectToRows('Distribution Center');
        await reportDatasetPanel.objectBrowser.clickFilterByCategory({ name: 'Folder (1)' });
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics']);
        await reportDatasetPanel.addObjectToColumns('Revenue');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 2, '1,454');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6511_08_02',
            'MDX report running mode after adding objects'
        );
    });

    it('[BCIN-6511_09] Create MDX report by attribute and metric on selected cube', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Country', 'Country']);
        await reportDatasetPanel.objectBrowser.waitForTooltipVisible();
        await reportPage.sleep(2000);
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6511_09_01', 'attribute tooltip to its path');
        await reportDatasetPanel.objectBrowser.doubleClickObject('Country');
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics']);
        await reportDatasetPanel.objectBrowser.doubleClickObject('Revenue');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '505,021');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6511_09_02',
            'MDX report running mode after adding objects'
        );
    });

    it('[BCIN-6511_10] expose mdx data source in root', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Country', 'Country']);
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToBottomInTreePopover();
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFolderBrowserTreePopover(),
            'BCIN-6511_10_01',
            'show mdx data source in root tree'
        );
    });

    it('[BCIN-6511_11] mdx report advanced settings', async () => {
        const incrementalFetchSetting = 'Incremental Fetch';
        const rowPerPageSetting = 'Rows per Page';
        const cachingSetting = 'Caching';
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportMenubar.clickSubMenuItem('File', 'Report Properties');
        await advancedReportProperties.selectReportPropertyType('Advanced Properties');
        await advancedReportProperties.typeInSearchBox(incrementalFetchSetting);
        await since('1. The report incremental fetch setting should be by default #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(incrementalFetchSetting))
            .toBe('Enable');
        await since(
            '2. The report incremental fetch row per page should be by default #{expected}, while we got #{actual}'
        )
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(rowPerPageSetting))
            .toBe('100');
        await advancedReportProperties.clear({ elem: advancedReportProperties.getSearchBox() });
        await advancedReportProperties.typeInSearchBox(cachingSetting);
        await since('3. The report caching setting should be #{expected}, while we got #{actual}')
            .expect(await advancedReportProperties.getPropertySettingDetailsByName(cachingSetting))
            .toBe('Use Inherited Value - Project Level');
        await advancedReportProperties.clear({ elem: advancedReportProperties.getSearchBox() });
        await advancedReportProperties.typeInSearchBox('mdx');
        await takeScreenshotByElement(
            advancedReportProperties.getReportPropertiesDialog(),
            'BCIN-6511_11_01',
            'mdx report advanced properties'
        );
    });
});
