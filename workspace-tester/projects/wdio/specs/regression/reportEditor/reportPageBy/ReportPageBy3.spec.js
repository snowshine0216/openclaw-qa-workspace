import * as reportConstants from '../../../../constants/report.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import { browserWindow } from '../../../../constants/index.js';

describe('Report Editor in Workstation', () => {
    let { loginPage, libraryPage, reportGridView, reportPageBy } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(reportConstants.reportUser);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await libraryPage.openDefaultApp();
        await libraryPage.handleError();
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC81156_6] FUN | Page by with show totals', async () => {
        await libraryPage.openReportByUrl({
            projectId: reportConstants.PageByMultiplePBShowTotal.project.id,
            documentId: reportConstants.PageByMultiplePBShowTotal.id,
        });

        // select total for Category
        await reportPageBy.changePageByElement('Category', 'Total');

        // check 2nd page by selector
        await since(
            'After select total for Category, the 2nd page by selector should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportPageBy.getPageBySelectorText('Subcategory'))
            .toBe('Art & Architecture');

        await reportPageBy.changePageByElement('Subcategory', 'Business');

        await since(
            'After select Business for Subcategory, grid cell at "1", "0" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Working With Emotional Intelligence');

        await since(
            'After select Business for Subcategory, grid cell at "1", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('$20,819');

        await since(
            'After select Business for Subcategory, grid cell at "2", "1" should have text #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 1))
            .toBe('$5,914');
    });
});
