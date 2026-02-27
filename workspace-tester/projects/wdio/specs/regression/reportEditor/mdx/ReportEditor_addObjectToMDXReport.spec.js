import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('MDX Report Add Objects', () => {
    let {
        loginPage,
        libraryPage,
        dossierCreator,
        reportPage,
        reportToolbar,
        reportEditorPanel,
        reportGridView,
        reportDatasetPanel,
    } = browsers.pageObj1;
    const testUser = reportConstants.reportMDXTestUser;
    const tutorialProject = reportConstants.tutorialProject;

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

    it('[BCIN-6530_01] Drag unmapped mdx object into report', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Account', 'Account Type']);
        await reportDatasetPanel.objectBrowser.doubleClickObject('Account Type');
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics', 'Exchange Rates']);
        await reportDatasetPanel.objectBrowser.doubleClickObject('Average Rate');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '1');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_01_01',
            'Adding unmapped MDX objects into report'
        );
    });

    // Fiscal Year -> Year in schema object
    it('[BCIN-6530_02] Add mapped mdx object into report from mdx folder', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Date', 'Date.Fiscal Year']);
        await reportDatasetPanel.addObjectToRows('Fiscal Year');
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics', 'Exchange Rates']);
        await reportDatasetPanel.addObjectToColumns('End of Day Rate');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '1');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_02_01',
            'Adding mapped MDX attribute into report'
        );
    });

    it('[BCIN-6530_03] Add mapped mdx object into report from schema object folder', async () => {
        await dossierCreator.createNewReport();
        await dossierCreator.switchProjectByName(tutorialProject.name);
        await dossierCreator.switchToMdxSourceTab();
        await dossierCreator.mdxSourceSelector.navigateInObjectBrowserFlatView([
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
        ]);
        await dossierCreator.clickCreateButton();
        await reportPage.waitForReportLoading(true);
        await reportPage.loadingDialog.waitForReportLoadingIsNotDisplayed();
        await reportDatasetPanel.objectBrowser.waitForLoading();
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Attributes']);
        await reportDatasetPanel.objectBrowser.searchObject('Time');
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Time']);
        await reportDatasetPanel.objectBrowser.searchObject('Year');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_03_01',
            'Disable unmapped schema object in MDX report object browser'
        );
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.scrollToBottom();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'Finance',
            'Metrics',
            'Financial Reporting',
        ]);
        await reportDatasetPanel.addObjectToColumns('Cost');
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 1, '3,250,075');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_03_02',
            'Adding mapped schema attribute into MDX report'
        );
    });

    it('[BCIN-6530_04] Cannot add mdx attributes from other mdx cube', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - TSSAP73',
            '$INFOCUBE',
            'Employee Sales',
            'Call Center',
            'Balanced GEO',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_04_01',
            'Disable unmapped MDX objects from other cube'
        );
        const rowsBefore = await reportEditorPanel.getRowsObjects();
        await reportDatasetPanel.objectBrowser.doubleClickObject('Level 01');
        const rowsAfter = await reportEditorPanel.getRowsObjects();
        await since('2. Total attributes in dropzone should be #{expected}, instead it is #{actual}')
            .expect(rowsBefore.length)
            .toBe(rowsAfter.length);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_04_02',
            'Cannot add unmapped MDX attribute from other cube'
        );
    });

    it('[BCIN-6530_05] Cannot add unmapped schema attributes to mdx report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Attributes']);
        await reportDatasetPanel.objectBrowser.searchObject('Time');
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Time']);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_05_01',
            'Disable unmapped schema objects'
        );
        await reportDatasetPanel.dndByMultiSelectFromObjectBrowserToReportObjectsPanel(
            ['Activity Period End Date', 'Activity Period End Month', 'Activity Period Start Month'],
            { dragOption: 'byPixel', isWait: false }
        );
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_05_02',
            'Cannot add unmapped schema attribute'
        );
    });

    it('[BCIN-6530_06] Cannot add schema metric to mdx report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Metrics', 'Sales Metrics']);
        await reportDatasetPanel.objectBrowser.clickFilterByCategory({ name: 'Metric' });
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_06_01',
            'Disable unmapped schema metrics'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToColumns('Average Revenue');
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_06_02',
            'Cannot add unmapped schema metric'
        );
    });

    it('[BCIN-6530_07] Add mapped metric from other mdx cube', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinanceNoCost.id,
            projectId: reportConstants.mdxReportByCubeFinanceNoCost.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - TSSAP73',
            'AV_TUTO',
            'Query_HierarchyNode_2_variables',
            'Metrics',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_07_01',
            'Mapped metric under other cube is available'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToMetrics('Cost');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(6, 6, '68,274,987');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_07_02',
            'Add mapped metric from other MDX cube'
        );
    });

    it('[BCIN-6530_08] Add mapped mdx attribute from other mdx cube', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinanceNoCost.id,
            projectId: reportConstants.mdxReportByCubeFinanceNoCost.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - TSSAP73',
            'AV_TUTO',
            'Query_HierarchyNode_2_variables',
            'Call Center',
            'Call Center',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_08_01',
            'Mapped attribute under other cube is available'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToRows('Call Center');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 6, '(2)');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_08_02',
            'Add mapped attribute from other MDX cube'
        );
    });

    it('[BCIN-6530_09] Add mapped mdx attribute to normal report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
            'Date',
            'Date.Fiscal',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_09_01',
            'Mapped mdx attribute is available in normal report'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToRows('Year');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$201,164');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_09_02',
            'mapped mdx attribute added to normal report'
        );
    });

    it('[BCIN-6530_10] Add mdx metric to normal report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.UIReportProductWithPageBy.id,
            projectId: reportConstants.UIReportProductWithPageBy.project.id,
        });
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
            'Metrics',
            'Exchange Rates',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_10_01',
            'mdx attribute is available in normal report'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToMetrics('Average Rate');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 5, '$201,164');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_10_02',
            'mdx metric added to normal report'
        );
    });

    it('[BCIN-6530_11] Add hierarchy to mdx report', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.mdxReportByCubeFinance.id,
            projectId: reportConstants.mdxReportByCubeFinance.project.id,
        });
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
            'Department',
        ]);
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getFlatObjectListContainer(),
            'BCIN-6530_11_01',
            'Hierarchy is available'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToRows('Departments');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(1, 8, '(2)');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_11_02',
            'hierarchy departments added to normal report'
        );
        await reportDatasetPanel.objectBrowser.openFolderBrowserPopover();
        await reportDatasetPanel.objectBrowser.scrollToTopInTreePopover();
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserPopover(['MicroStrategy Tutorial']);
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView([
            'MDX Data Sources',
            'Data Explorer - .DDSET_MDX',
            'AdventureWorksDW',
            'Finance',
            'Account',
        ]);
        await reportEditorPanel.dndObjectFromObjectBrowserToMetrics('Account');
        await reportPage.waitForReportLoading(true);
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_11_02',
            'Add hierarchy account to mdx report'
        );
    });

    it('[BCIN-6530_12] Only allow to add one hierarchy per dimension for SAP datasource', async () => {
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
        await reportDatasetPanel.objectBrowser.navigateInObjectBrowserFlatView(['Call Center']);
        await reportDatasetPanel.addObjectToRows('Balanced GEO');
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getObjectListFlatView(),
            'BCIN-6530_12_01',
            'Disable other hierarchies under same dimension'
        );
        await reportDatasetPanel.openObjectContextMenu('Ban_hie');
        await since('1. context menu should not be open, instead it is open')
            .expect(await reportDatasetPanel.ContextMenu.isDisplayed())
            .toBe(false);
        await reportDatasetPanel.esc();
        await reportDatasetPanel.objectBrowser.doubleClickObject('Ragged GEO');
        await reportDatasetPanel.clickToCloseContextMenu();
        await takeScreenshotByElement(
            reportPage.getContainer(),
            'BCIN-6530_12_02',
            'Cannot add second hierarchy under same dimension'
        );
        await reportDatasetPanel.objectBrowser.clickFolderUpButton();
        await reportDatasetPanel.addObjectToRows('Country');
        await reportDatasetPanel.objectBrowser.openContextMenuOnObject({ name: 'Country', isWait: false });
        await since('2. context menu should not be open if the hierarchy is already added, instead it is open')
            .expect(await reportDatasetPanel.ContextMenu.isDisplayed())
            .toBe(false);
        await reportDatasetPanel.esc();
        await takeScreenshotByElement(
            reportDatasetPanel.objectBrowser.getObjectListFlatView(),
            'BCIN-6530_12_03',
            'Hierarchies under different dimensions are available'
        );
        await reportEditorPanel.dndObjectFromObjectBrowserToRows('Manager');
        await reportPage.waitForReportLoading(true);
        await reportToolbar.switchToDesignMode();
        await reportGridView.waitForGridCellToBeExpectedValue(0, 0, 'Level 01');
        await reportDatasetPanel.clickBottomBarToLoseFocus();
        await takeScreenshotByElement(reportPage.getContainer(), 'BCIN-6530_12_05', 'Execute the report');
    });
});
