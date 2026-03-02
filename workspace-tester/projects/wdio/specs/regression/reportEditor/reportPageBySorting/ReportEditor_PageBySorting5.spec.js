import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('Page by Sorting in report editor', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportPageBy,
        reportDatasetPanel,
        reportEditorPanel,
        reportPageBySorting,
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

    it('[TC0000_1] X-Fun test on page by sorting in report editor (Workstation) -- Hierarchy in Page By', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.DeveloperPBHierarchy.id,
            projectId: reportConstants.DeveloperPBHierarchy.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await reportDatasetPanel.dndFromObjectPanelToContainer('Time', 'pageby');
        await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC0000_1', 'dimension_time');
        await since(
            'The current selection for page by selector "Month" is expected to be Jan 2014, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Month'))
            .toContain('Jan 2014');
        await reportDatasetPanel.dndFromObjectPanelToContainer('Category', 'pageby');
        await takeScreenshotByElement(reportEditorPanel.columnsDropzone, 'TC0000_2', 'attribute_category');
        await since(
            'The current selection for page by selector "Category" is expected to be Books, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toContain('Books');
        await reportPageBy.openSelectorContextMenu('Month');
        await reportPageBy.clickContextMenuOption('Sort');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_3', 'page_by_sorting_dialog');
        await reportPageBySorting.openDropdown(1, 'Sort By');
        await since('Option "Category" is expected to be available in the dropdown for column "Sort By" on row 1')
            .expect(await reportPageBySorting.getDropDownItem(1, 'Sort By', 'Category'))
            .toBeDisplayed();
        await since('Option "Time" is not expected to be available in the dropdown for column "Sort By" on row 1')
            .expect(await reportPageBySorting.getDropDownItem(1, 'Sort By', 'Time'))
            .not.toBeDisplayed();
        await since('Option "Month" is not expected to be available in the dropdown for column "Sort By" on row 1')
            .expect(await reportPageBySorting.getDropDownItem(1, 'Sort By', 'Month'))
            .not.toBeDisplayed();
        await reportPageBySorting.selectFromDropdown(1, 'Sort By', 'Category');
        await reportPageBySorting.selectFromDropdown(1, 'Criteria', 'DESC');
        await reportPageBySorting.selectFromDropdown(1, 'Order', 'Descending');
        await reportPageBySorting.clickBtn('Done');
        await takeScreenshotByElement(reportPageBySorting.dialog, 'TC0000_4', 'page_by_sorting_dialog_closed');
        await since(
            'The current selection for page by selector "Month" is expected to be Jan 2014, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Month'))
            .toContain('Jan 2014');
        await since(
            'The current selection for page by selector "Category" is expected to be Music, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Category'))
            .toContain('Music');
    });
});
