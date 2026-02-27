import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportDatasetPanel,
        reportGridView,
        reportPageBy,
        reportEditorPanel,
        pageBySorting,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC85430] X-Fun test on page by sorting in report editor (Workstation) -- Move or Remove PageBy Object', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportWS_PB_YearCategory1.id,
            projectId: reportConstants.ReportWS_PB_YearCategory1.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_1', 'grid');
        await reportPageBy.openSelectorContextMenu('Year');
        await reportPageBy.clickContextMenuOption('Sort');
        await takeScreenshotByElement(pageBySorting.dialog, 'TC0000_2', 'dialog');
        await pageBySorting.openDropdown(1, 'Sort By');
        await pageBySorting.selectFromDropdown(1, 'Sort By', 'Year');
        await pageBySorting.openDropdown(1, 'Criteria');
        await pageBySorting.selectFromDropdown(1, 'Criteria', 'ID');
        await pageBySorting.openDropdown(1, 'Order');
        await pageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await pageBySorting.openDropdown(2, 'Sort By');
        await pageBySorting.selectFromDropdown(2, 'Sort By', 'Category');
        await pageBySorting.openDropdown(2, 'Criteria');
        await pageBySorting.selectFromDropdown(2, 'Criteria', 'DESC');
        await pageBySorting.openDropdown(2, 'Order');
        await pageBySorting.selectFromDropdown(2, 'Order', 'Descending');
        await pageBySorting.clickBtn('Done');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_3', 'grid');
        await reportPageBy.openSelectorContextMenu('Year');
        await reportPageBy.clickContextMenuOption('Move');
        await takeScreenshotByElement(pageBySorting.dialog, 'TC0000_4', 'dialog');
        await pageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_5', 'grid');
        await reportPageBy.openSelectorContextMenu('Category');
        await reportPageBy.clickContextMenuOption('Sort');
        await takeScreenshotByElement(pageBySorting.dialog, 'TC0000_6', 'dialog');
        await pageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_7', 'grid');
        await reportEditorPanel.removeObjectInDropzone('PageBy', 'attribute', 'Year');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_8', 'grid');
        // await reportDatasetPanel.switchToInReportTab();
        await reportDatasetPanel.addObjectToPageBy('Year');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_9', 'grid');
        await reportPageBy.openSelectorContextMenu('Category');
        await reportPageBy.clickContextMenuOption('Sort');
        await takeScreenshotByElement(pageBySorting.dialog, 'TC0000_10', 'dialog');
        await pageBySorting.clickBtn('Cancel');
        await takeScreenshotByElement(reportGridView.grid, 'TC0000_11', 'grid');
    });
});
