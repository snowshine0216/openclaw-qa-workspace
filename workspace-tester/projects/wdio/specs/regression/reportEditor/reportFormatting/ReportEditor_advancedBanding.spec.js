import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report editor advanced banding formatting', () => {
    let {
        loginPage,
        libraryPage,
        reportToolbar,
        reportDatasetPanel,
        reportFormatPanel,
        reportGridView,
        newFormatPanelForGrid,
        reportTOC,
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

    it('[TC83064] Functional [Workstation][Report Editor] Advanced banding formatting', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Products']);
        await reportDatasetPanel.addMultipleObjectsToRows(['Subcategory', 'Category']);
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Cost Growth', 'Profit', 'Profit Margin']);
        await reportToolbar.switchToDesignMode();
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.enableBanding();
        await since(
            `After enableBanding, The grid cells at "1", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
        await since(
            `After enableBanding, The grid cells at "2", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));
        await since(
            `After enableBanding, The grid cells at "3", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 3, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
        await since(
            `After enableBanding, The grid cells at "4", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 4, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));

        await reportFormatPanel.selectBandingByRows();
        await reportFormatPanel.applyColorByNumberOfRows();
        await reportFormatPanel.setApplyColorEvery('3');
        await since(
            `After aplly color every 3 rows, The grid cells at "1", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
        await since(
            `After aplly color every 3 rows, The grid cells at "2", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
        await since(
            `After aplly color every 3 rows, The grid cells at "3", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 3, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,255,255,1)')));
        await since(
            `After aplly color every 3 rows, The grid cells at "4", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 4, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));
        await since(
            `After aplly color every 3 rows, The grid cells at "5", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 5, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));
        await since(
            `The grid cells at "6", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 6, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(246,246,246,1)')));

        // 8. Select first banding color as "Peach" and second as "Porcelain"
        // await reportFormatPanel.openBandingColorPicker('First');
        // await newFormatPanelForGrid.clickBuiltInColor('#FFDEC6');
        // await reportFormatPanel.openBandingColorPicker('Second');
        // await newFormatPanelForGrid.clickBuiltInColor('#DEDEDE');
        await reportFormatPanel.changeFirstBandingColor('#FFDEC6');
        await reportFormatPanel.changeSecondBandingColor('#DEDEDE');
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "1", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "2", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "3", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 3, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "4", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 4, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "5", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 5, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));
        await since(
            `After select first banding color as "Peach" and second as "Porcelain", The grid cells at "6", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 6, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));

        // # 9. Select "Apply Color By" as "Row Header"
        await reportFormatPanel.openApplyColorBySelectionBox();
        await reportFormatPanel.applyColorByRowHeader();
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "1", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "2", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "3", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 3, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "5", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 5, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "6", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 6, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "7", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 7, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select "Apply Color By" as "Row Header", The grid cells at "8", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 8, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));

        // Select header as "Category"
        await reportFormatPanel.openBandingHeaderSelectionBox();
        await reportFormatPanel.selectOptionFromDropdown('Category');
        await since(
            `After select header as "Category", The grid cells at "1", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 1, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select header as "Category", The grid cells at "2", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 2, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));
        await since(
            `After select header as "Category", The grid cells at "3", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 3, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(255,222,198,1)')));
        await since(
            `After select header as "Category", The grid cells at "4", "0"-"4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(JSON.stringify(await reportGridView.getGridCellStyleByRows(0, 4, 4, 'background-color')))
            .toBe(JSON.stringify(Array(5).fill('rgba(222,222,222,1)')));

        // 11. Select banding for "Column", select "Metrics" as "Row Header"
        await reportFormatPanel.selectBandingBy('Column');
        await reportFormatPanel.selectBandingHeader('Metrics');
        await since(
            `After select banding for "Column", select "Metrics" as "Row Header", The grid cells at "0"-"24", "2" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));
        await since(
            `After select banding for "Column", select "Metrics" as "Row Header", The grid cells at "0"-"24", "3" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(222,222,222,1)')));
        await since(
            `After select banding for "Column", select "Metrics" as "Row Header", The grid cells at "0"-"24", "4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));
        await since(
            `After select banding for "Column", select "Metrics" as "Row Header", The grid cells at "0"-"24", "5" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 5, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(222,222,222,1)')));

        // 12. Select "Apply Color By" as "Number of Columns"
        await reportFormatPanel.openApplyColorBySelectionBox();
        await reportFormatPanel.applyColorByNumberOfColumns();
        await since(
            `After select "Apply Color By" as "Number of Columns", The grid cells at "0"-"24", "2" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));
        await since(
            `After select "Apply Color By" as "Number of Columns", The grid cells at "0"-"24", "3" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));
        await since(
            `The grid cells at "0"-"24", "4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));

        // 13. Set "Apply Color Every" as "1"
        await reportFormatPanel.setApplyColorEvery('1');
        await since(
            `After set "Apply Color Every" as "1", The grid cells at "0"-"24", "2" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));
        await since(
            `After set "Apply Color Every" as "1", The grid cells at "0"-"24", "3" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(222,222,222,1)')));
        await since(
            `After set "Apply Color Every" as "1", The grid cells at "0"-"24", "4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,222,198,1)')));

        // 14. Select first banding color as "Coral" and second as "Silver"
        await reportFormatPanel.openBandingColorPicker('First');
        await newFormatPanelForGrid.clickBuiltInColor('#FFAE8B');
        await reportFormatPanel.openBandingColorPicker('Second');
        await newFormatPanelForGrid.clickBuiltInColor('#ABABAB');
        await since(
            `After select first banding color as "Coral" and second as "Silver", The grid cells at "0"-"24", "2" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 2, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,174,139,1)')));
        await since(
            `After select first banding color as "Coral" and second as "Silver", The grid cells at "0"-"24", "3" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 3, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(171,171,171,1)')));
        await since(
            `After select first banding color as "Coral" and second as "Silver", After select first banding color as "Coral" and second as "Silver",    The grid cells at "0"-"24", "4" have style "background-color" with value "#{expected}" instead we have "#{actual}"`
        )
            .expect(await reportGridView.getGridCellStyleByCols(0, 24, 4, 'background-color'))
            .toBe(JSON.stringify(Array(25).fill('rgba(255,174,139,1)')));
    });
});
