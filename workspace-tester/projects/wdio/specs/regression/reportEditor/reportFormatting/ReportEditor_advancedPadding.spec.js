import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report editor advanced padding formatting', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportFormatPanel,
        reportTOC,
        reportGridView,
        newFormatPanelForGrid,
    } = browsers.pageObj1;

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

    it('[TC83061] Functional [Workstation][Report Editor] Cell padding formatting', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Geography']);
        await reportDatasetPanel.addMultipleObjectsToRows(['Region']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(1);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Products']);
        await reportDatasetPanel.addMultipleObjectsToRows(['Category']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit', 'Profit Margin']);
        await reportToolbar.switchToDesignMode();
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandSpacingSection();
        await newFormatPanelForGrid.selectCellPadding('small');
        await since(
            'After select cell padding "small", I verify the "Top" padding value is "2.3" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Top'))
            .toBe('2.3');
        await since(
            'After select cell padding "small", I verify the "Right" padding value is "4.5" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Right'))
            .toBe('4.5');
        await since(
            'After select cell padding "small", I verify the "Bottom" padding value is "2.3" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Bottom'))
            .toBe('2.3');
        await since(
            'After select cell padding "small", I verify the "Left" padding value is "4.5" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('4.5');
        await newFormatPanelForGrid.selectCellPadding('medium');
        await since(
            'After select cell padding "medium", I verify the "Top" padding value is "5.2" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Top'))
            .toBe('5.2');
        await since(
            'After select cell padding "medium", I verify the "Right" padding value is "10.5" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Right'))
            .toBe('10.5');
        await since(
            'After select cell padding "medium", I verify the "Bottom" padding value is "5.2" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Bottom'))
            .toBe('5.2');
        await since(
            'After select cell padding "medium", I verify the "Left" padding value is "10.5" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('10.5');

        await newFormatPanelForGrid.selectCellPadding('large');
        await since(
            'After select cell padding "large", I verify the "Top" padding value is "6" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Top'))
            .toBe('6');
        await since(
            'After select cell padding "large", I verify the "Right" padding value is "12" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Right'))
            .toBe('12');
        await since(
            'After select cell padding "large", I verify the "Bottom" padding value is "6" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Bottom'))
            .toBe('6');
        await since(
            'After select cell padding "large", I verify the "Left" padding value is "12" in Report Editor, instead we have #{actual}'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('12');

        // 7. Set padding values manually
        // click tab to disable focus on large padding value
        await reportTOC.switchToFormatPanel();
        await reportFormatPanel.setPaddingValue('Top', '5');
        await reportFormatPanel.setPaddingValue('Right', '7');
        await reportFormatPanel.setPaddingValue('Bottom', '2.5');
        await reportFormatPanel.setPaddingValue('Left', '19');
        await since(
            'After set padding values manually, the grid cells at "0", "0"-"4" have style "padding" with value "#{expected}" instead we have "#{actual}"'
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 0, 'padding')))
            .toBe(JSON.stringify(Array(5).fill('6px 9px 3px 25px')));
        await since(
            'After set padding values manually, the grid cells at "1", "0"-"4" have style "padding" with value "#{expected}" instead we have "#{actual}"'
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'padding')))
            .toBe(JSON.stringify(Array(5).fill('6px 9px 3px 25px')));
        //  # 8. In "Left" option click "decreasing arrow" 1 time
        await reportFormatPanel.clickOnPaddingArrowButton('Left', 'down', 1);
        await since(
            'After click "decreasing arrow" 1 time, I verify the "Left" padding value is "#{expected}" in Report Editor, instead we have "#{actual}"'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('18');
        // # 9. In "Left" option click "increasing arrow" 2 times
        await reportFormatPanel.clickOnPaddingArrowButton('Left', 'up', 2);
        // Then I verify the "Left" padding value is "20" in Report Editor
        await since(
            'After click "increasing arrow" 2 times, I verify the "Left" padding value is "#{expected}" in Report Editor, instead we have "#{actual}"'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('20');
        // # 10. In "Left" click "increasing arrow" again - maximum value is 20, so its not possible use value more then 20
        await reportFormatPanel.clickOnPaddingArrowButton('Left', 'up', 1);
        await since(
            'After click "increasing arrow" again, After click "increasing arrow" again, I verify the "Left" padding value is "#{expected}" in Report Editor, instead we have "#{actual}"'
        )
            .expect(await reportFormatPanel.getPaddingValue('Left'))
            .toBe('20');
    });
});
