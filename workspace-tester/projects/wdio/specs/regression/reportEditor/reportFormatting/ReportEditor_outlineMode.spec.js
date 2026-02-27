import * as reportConstants from '../../../../constants/report.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import { browserWindow } from '../../../../constants/index.js';
import setWindowSize from '../../../../config/setWindowSize.js';

describe('Report Outline Mode', () => {
    let {
        loginPage,
        libraryPage,
        reportDatasetPanel,
        reportToolbar,
        reportGridView,
        reportTOC,
        newFormatPanelForGrid,
        reportFormatPanel,
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

    it('[TC88431_1] FUN | Report Editor | Grid View | Outline Mode', async () => {
        await libraryPage.createNewReportByUrl({});
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Schema Objects', 'Attributes', 'Time']);
        await reportDatasetPanel.addObjectToRows('Year');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Geography');
        await reportDatasetPanel.addObjectToRows('Region');
        await reportDatasetPanel.clickFolderUpIcon();
        await reportDatasetPanel.selectItemInObjectList('Products');
        await reportDatasetPanel.addObjectToRows('Category');
        await reportDatasetPanel.clickFolderUpMultipleTimes(3);
        await reportDatasetPanel.selectMultipleItemsInObjectList(['Public Objects', 'Metrics', 'Sales Metrics']);
        await reportDatasetPanel.addMultipleObjectsToColumns(['Cost', 'Profit']);
        await reportToolbar.switchToDesignMode();
        await since(
            'After switching to design mode, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After switching to design mode, The grid cell at "0", "1" should has text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since(
            'After switching to design mode, The grid cell at "0", "2" should has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since(
            'After switching to design mode, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After switching to design mode, The grid cell at "0", "4" should has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After switching to design mode, The grid cell at "5", "1" should has text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(5, 1))
            .toBe('Mid-Atlantic');
        await since(
            'After switching to design mode, The grid cell at "6", "2" should has text "Electronics", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(6, 2))
            .toBe('Electronics');
        await since(
            'After switching to design mode, The grid cell at "7", "3" should has text "$125,621", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(7, 3))
            .toBe('$125,621');
        await since(
            'After switching to design mode, The grid cell at "8", "4" should has text "$5,700", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 4))
            .toBe('$5,700');
        // # 3. Enable grid outline mode in compact mode and validate
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.enableOutlineMode();
        await since(
            'After switching to outline mode, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After switching to outline mode, The grid cell at "0", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "0", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After switching to outline mode, The grid cell at "0", "4" should has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After switching to outline mode, The grid cell at "1", "0" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 0).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "1", "2" should has text "Total", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Total');
        await since(
            'After switching to outline mode, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After switching to outline mode, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After switching to outline mode, The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After switching to outline mode, The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After switching to outline mode, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since('After switching to outline mode, The grid cell at "3", "1" should not be present')
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "4", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(4, 2).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "43", "0" should has text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since(
            'After switching to outline mode, The grid cell at "44", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(44, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "84", "0" should has text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 0))
            .toBe('2016');
        await since(
            'After switching to outline mode, The grid cell at "85", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(85, 1).isDisplayed())
            .toBe(false);
        await reportGridView.clickOutlineIconFromCH('Year');
        await since(
            'After switching to outline mode, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After switching to outline mode, The grid cell at "0", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "0", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After switching to outline mode, The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "1", "2" should has text "Total", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Total');
        await since(
            'After switching to outline mode, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After switching to outline mode, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After switching to outline mode, The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After switching to outline mode, The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After switching to outline mode, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After switching to outline mode, The grid cell at "3", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Central');
        await since(
            'After switching to outline mode, The grid cell at "3", "3" should has text "$1,097,333", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$1,097,333');
        await since(
            'After switching to outline mode, The grid cell at "4", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('Books');
        await since(
            'After switching to outline mode, The grid cell at "4", "3" should has text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$77,012');
        await since(
            'After switching to outline mode, The grid cell at "4", "4" should has text "$21,190", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 4))
            .toBe('$21,190');
        await reportGridView.collapseOutlineFromCell('2014');
        await since('After collapse 2014, The grid cell at "0", "0" should has text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since('After collapse 2014, The grid cell at "0", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(0, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2014, The grid cell at "0", "2" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(false);
        await since('After collapse 2014, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After collapse 2014, The grid cell at "0", "4" should has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since('After collapse 2014, The grid cell at "1", "0" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(1, 0).isDisplayed())
            .toBe(false);
        await since('After collapse 2014, The grid cell at "1", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2014, The grid cell at "1", "2" should has text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Total');
        await since(
            'After collapse 2014, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After collapse 2014, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since('After collapse 2014, The grid cell at "2", "0" should has text "2014", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since('After collapse 2014, The grid cell at "2", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse 2014, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After collapse 2014, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since('After collapse 2014, The grid cell at "3", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2014, The grid cell at "43", "0" should has text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since(
            'After collapse 2014, The grid cell at "43", "3" should has text "$9,777,521", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 3))
            .toBe('$9,777,521');
        await since(
            'After collapse 2014, The grid cell at "43", "4" should has text "$1,740,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 4))
            .toBe('$1,740,085');
        await since(
            'After collapse 2014, The grid cell at "44", "3" should has text "$1,412,535", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 3))
            .toBe('$1,412,535');
        await since(
            'After collapse 2014, The grid cell at "44", "4" should has text "$254,469", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 4))
            .toBe('$254,469');
        await since(
            'After collapse 2014, The grid cell at "45", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(45, 2))
            .toBe('Books');
        await since(
            'After collapse 2014, The grid cell at "45", "4" should has text "$26,768", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(45, 4))
            .toBe('$26,768');
        await reportGridView.collapseOutlineFromCell('2015');
        await since('After collapse 2015, The grid cell at "0", "0" should has text "Year", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since('After collapse 2015, The grid cell at "0", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(0, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "0", "2" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since('After collapse 2015, The grid cell at "1", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "1", "2" should has text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Total');
        await since(
            'After collapse 2015, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After collapse 2015, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since('After collapse 2015, The grid cell at "2", "0" should has text "2014", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since('After collapse 2015, The grid cell at "2", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "2", "2" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse 2015, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After collapse 2015, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since('After collapse 2015, The grid cell at "3", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "4", "2" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(4, 2).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "43", "0" should has text "2015", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since('After collapse 2015, The grid cell at "44", "1" should not be present, instead we have #{actual}')
            .expect(await reportGridView.getGridCellByPos(44, 1).isDisplayed())
            .toBe(false);
        await since('After collapse 2015, The grid cell at "84", "0" should has text "2016", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(84, 0))
            .toBe('2016');
        await since(
            'After collapse 2015, The grid cell at "84", "3" should has text "$12,609,467", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 3))
            .toBe('$12,609,467');
        await since(
            'After collapse 2015, The grid cell at "84", "4" should has text "$2,249,397", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 4))
            .toBe('$2,249,397');
        await since(
            'After collapse 2015, The grid cell at "85", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 1))
            .toBe('Central');
        await since(
            'After collapse 2015, The grid cell at "85", "3" should has text "$1,755,176", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 3))
            .toBe('$1,755,176');
        await since(
            'After collapse 2015, The grid cell at "85", "4" should has text "$313,552", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 4))
            .toBe('$313,552');
        await since(
            'After collapse 2015, The grid cell at "86", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 2))
            .toBe('Books');
        await since(
            'After collapse 2015, The grid cell at "86", "3" should has text "$121,216", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 3))
            .toBe('$121,216');
        await since(
            'After collapse 2015, The grid cell at "86", "4" should has text "$33,373", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 4))
            .toBe('$33,373');
        // # 4. Enable grid outline mode in standard mode and validate
        await reportFormatPanel.enableStandardOutlineMode();
        await since(
            'After enable standard outline mode, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After enable standard outline mode, The grid cell at "0", "1" existence should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 1).isDisplayed())
            .toBe(true);
        await since(
            'After enable standard outline mode, The grid cell at "0", "2" existence should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(true);
        await since(
            'After enable standard outline mode, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After enable standard outline mode, The grid cell at "0", "4" should has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After enable standard outline mode, The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "1", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 2).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After enable standard outline mode, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After enable standard outline mode, The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After enable standard outline mode, The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After enable standard outline mode, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After enable standard outline mode, The grid cell at "3", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "4", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(4, 2).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "43", "0" should has text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since(
            'After enable standard outline mode, The grid cell at "44", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(44, 1).isDisplayed())
            .toBe(false);
        await since(
            'After enable standard outline mode, The grid cell at "84", "0" should has text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 0))
            .toBe('2016');
        await since(
            'After enable standard outline mode, The grid cell at "84", "3" should has text "$12,609,467", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 3))
            .toBe('$12,609,467');
        await since(
            'After enable standard outline mode, The grid cell at "84", "4" should has text "$2,249,397", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 4))
            .toBe('$2,249,397');
        await reportGridView.clickOutlineIconFromCH('Year');
        await since(
            'After click outline icon from Year, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After click outline icon from Year, The grid cell at "0", "1" should has text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since(
            'After click outline icon from Year, The grid cell at "0", "2" existence should be #{expected}, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(0, 2).isDisplayed())
            .toBe(true);
        await since(
            'After click outline icon from Year, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After click outline icon from Year, The grid cell at "1", "0" should has text "Total", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');
        await since(
            'After click outline icon from Year, The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Year, The grid cell at "1", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 2).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Year, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After click outline icon from Year, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After click outline icon from Year, The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After click outline icon from Year, The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Year, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After click outline icon from Year, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After click outline icon from Year, The grid cell at "3", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Central');
        await since(
            'After click outline icon from Year, The grid cell at "3", "3" should has text "$1,097,333", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$1,097,333');
        await since(
            'After click outline icon from Year, The grid cell at "3", "4" should has text "$196,301", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('$196,301');
        await since(
            'After click outline icon from Year, The grid cell at "4", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(4, 2).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Year, The grid cell at "8", "1" should has text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 1))
            .toBe('Mid-Atlantic');
        await since(
            'After click outline icon from Year, The grid cell at "8", "3" should has text "$968,654", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$968,654');
        await since(
            'After click outline icon from Year, The grid cell at "8", "4" should has text "$171,354", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 4))
            .toBe('$171,354');
        await since(
            'After click outline icon from Year, The grid cell at "44", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 1))
            .toBe('Central');
        await since(
            'After click outline icon from Year, The grid cell at "84", "0" should has text "2016", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 0))
            .toBe('2016');
        await since(
            'After click outline icon from Year, The grid cell at "85", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 1))
            .toBe('Central');
        await reportGridView.clickOutlineIconFromCH('Region');
        await since(
            'After click outline icon from Region, The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After click outline icon from Region, The grid cell at "0", "1" should has text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since(
            'After click outline icon from Region, The grid cell at "0", "2" should has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since(
            'After click outline icon from Region, The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After click outline icon from Region, The grid cell at "1", "0" should has text "Total", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');
        await since(
            'After click outline icon from Region, The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Region, The grid cell at "1", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 2).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Region, The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After click outline icon from Region, The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After click outline icon from Region, The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After click outline icon from Region, The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Region, The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After click outline icon from Region, The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After click outline icon from Region, The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After click outline icon from Region, The grid cell at "3", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Central');
        await since(
            'After click outline icon from Region, The grid cell at "3", "3" should has text "$1,097,333", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 3))
            .toBe('$1,097,333');
        await since(
            'After click outline icon from Region, The grid cell at "3", "4" should has text "$196,301", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 4))
            .toBe('$196,301');
        await since(
            'After click outline icon from Region, The grid cell at "4", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('Books');
        await since(
            'After click outline icon from Region, The grid cell at "4", "3" should has text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$77,012');
        await since(
            'After click outline icon from Region, The grid cell at "4", "4" should has text "$21,190", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 4))
            .toBe('$21,190');
        await since(
            'After click outline icon from Region, The grid cell at "8", "1" should has text "Mid-Atlantic", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 1))
            .toBe('Mid-Atlantic');
        await since(
            'After click outline icon from Region, The grid cell at "8", "3" should has text "$968,654", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 3))
            .toBe('$968,654');
        await since(
            'After click outline icon from Region, The grid cell at "8", "4" should has text "$171,354", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(8, 4))
            .toBe('$171,354');
        await reportGridView.collapseOutlineFromCell('2014');
        await since(
            'After collapse outline from cell "2014", The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After collapse outline from cell "2014", The grid cell at "0", "1" should has text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since(
            'After collapse outline from cell "2014", The grid cell at "0", "2" should has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since(
            'After collapse outline from cell "2014", The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After collapse outline from cell "2014", The grid cell at "1", "0" should has text "Total", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('Total');
        await since(
            'After collapse outline from cell "2014", The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2014", The grid cell at "1", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2014", The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After collapse outline from cell "2014", The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After collapse outline from cell "2014", The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After collapse outline from cell "2014", The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2014", The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2014", The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After collapse outline from cell "2014", The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After collapse outline from cell "2014", The grid cell at "3", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2014", The grid cell at "43", "0" should has text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since(
            'After collapse outline from cell "2014", The grid cell at "43", "3" should has text "$9,777,521", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 3))
            .toBe('$9,777,521');
        await since(
            'After collapse outline from cell "2014", The grid cell at "43", "4" should has text "$1,740,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 4))
            .toBe('$1,740,085');
        await since(
            'After collapse outline from cell "2014", The grid cell at "44", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 1))
            .toBe('Central');
        await since(
            'After collapse outline from cell "2014", The grid cell at "44", "3" should has text "$1,412,535", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 3))
            .toBe('$1,412,535');
        await since(
            'After collapse outline from cell "2014", The grid cell at "44", "4" should has text "$254,469", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(44, 4))
            .toBe('$254,469');
        await since(
            'After collapse outline from cell "2014", The grid cell at "45", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(45, 2))
            .toBe('Books');
        await since(
            'After collapse outline from cell "2014", The grid cell at "45", "4" should has text "$26,768", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(45, 4))
            .toBe('$26,768');
        await reportGridView.collapseOutlineFromCell('2015');
        await since(
            'After collapse outline from cell "2015", The grid cell at "0", "0" should has text "Year", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 0))
            .toBe('Year');
        await since(
            'After collapse outline from cell "2015", The grid cell at "0", "1" should has text "Region", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 1))
            .toBe('Region');
        await since(
            'After collapse outline from cell "2015", The grid cell at "0", "2" should has text "Category", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 2))
            .toBe('Category');
        await since(
            'After collapse outline from cell "2015", The grid cell at "0", "3" should has text "Cost", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 3))
            .toBe('Cost');
        await since(
            'After collapse outline from cell "2015", The grid cell at "0", "4" should has text "Profit", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(0, 4))
            .toBe('Profit');
        await since(
            'After collapse outline from cell "2015", The grid cell at "1", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "1", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(1, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "1", "3" should has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');
        await since(
            'After collapse outline from cell "2015", The grid cell at "1", "4" should has text "$5,293,624", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 4))
            .toBe('$5,293,624');
        await since(
            'After collapse outline from cell "2015", The grid cell at "2", "0" should has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After collapse outline from cell "2015", The grid cell at "2", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "2", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(2, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "2", "3" should has text "$7,343,097", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 3))
            .toBe('$7,343,097');
        await since(
            'After collapse outline from cell "2015", The grid cell at "2", "4" should has text "$1,304,141", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 4))
            .toBe('$1,304,141');
        await since(
            'After collapse outline from cell "2015", The grid cell at "3", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(3, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "4", "2" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(4, 2).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "43", "0" should has text "2015", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(43, 0))
            .toBe('2015');
        await since(
            'After collapse outline from cell "2015", The grid cell at "44", "1" should not be present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos(44, 1).isDisplayed())
            .toBe(false);
        await since(
            'After collapse outline from cell "2015", The grid cell at "84", "3" should has text "$12,609,467", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 3))
            .toBe('$12,609,467');
        await since(
            'After collapse outline from cell "2015", The grid cell at "84", "4" should has text "$2,249,397", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(84, 4))
            .toBe('$2,249,397');
        await since(
            'After collapse outline from cell "2015", The grid cell at "85", "1" should has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 1))
            .toBe('Central');
        await since(
            'After collapse outline from cell "2015", The grid cell at "85", "3" should has text "$1,755,176", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 3))
            .toBe('$1,755,176');
        await since(
            'After collapse outline from cell "2015", The grid cell at "85", "4" should has text "$313,552", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(85, 4))
            .toBe('$313,552');
        await since(
            'After collapse outline from cell "2015", The grid cell at "86", "2" should has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 2))
            .toBe('Books');
        await since(
            'After collapse outline from cell "2015", The grid cell at "86", "3" should has text "$121,216", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 3))
            .toBe('$121,216');
        await since(
            'After collapse outline from cell "2015", The grid cell at "86", "4" should has text "$33,373", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(86, 4))
            .toBe('$33,373');
    });
    it('[TC88431_2] DE241713: Make sure outline mode expand/collapse state persists during column resize', async () => {
        await libraryPage.editReportByUrl({
            dossierId: reportConstants.ReportPageByContextMenu.id,
            projectId: reportConstants.ReportPageByContextMenu.project.id,
        });
        await reportToolbar.switchToDesignMode();
        await since(
            'After switch to design mode, The grid cell at "1", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 0))
            .toBe('2014');
        await since(
            'After switch to design mode, The grid cell at "1", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 1))
            .toBe('Central');
        await since(
            'After switch to design mode, The grid cell at "1", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Books');
        await since(
            'After switch to design mode, The grid cell at "1", "3" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$77,012');
        await reportTOC.switchToFormatPanel();
        await newFormatPanelForGrid.expandLayoutSection();
        await reportFormatPanel.enableOutlineMode();
        await since('After enable outline mode, The grid cell at "1", "2" has text "Total", instead we have #{actual}')
            .expect(await reportGridView.getGridCellTextByPos(1, 2))
            .toBe('Total');
        await since(
            'After enable outline mode, The grid cell at "1", "3" has text "$29,730,085", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(1, 3))
            .toBe('$29,730,085');

        await reportGridView.clickOutlineIconFromCH('Year');
        await since(
            'After click outline icon from "Year", The grid cell at "2", "0" has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After click outline icon from "Year", The grid cell at "3", "1" has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Central');
        await since(
            'After click outline icon from "Year", The grid cell at "4", "2" has text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('Books');
        await since(
            'After click outline icon from "Year", The grid cell at "4", "3" has text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$77,012');

        await since(
            'After click outline icon from "Year", The element at "2", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('2', '0'))
            .toBe(true);
        await reportGridView.resizeColumnByMovingBorder('0', 100, 'right');
        await since(
            'After resize column by moving border, The grid cell at "2", "0" should have text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(2, 0))
            .toBe('2014');
        await since(
            'After resize column by moving border, The grid cell at "3", "1" should have text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(3, 1))
            .toBe('Central');
        await since(
            'After resize column by moving border, The grid cell at "4", "2" should have text "Books", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 2))
            .toBe('Books');
        await since(
            'After resize column by moving border, The grid cell at "4", "3" should have text "$77,012", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellTextByPos(4, 3))
            .toBe('$77,012');
        await since(
            'After resize column by moving border, After resize column by moving border, The element at "2", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('2', '0'))
            .toBe(true);
        await reportGridView.collapseOutlineFromCell('2014');
        await since(
            'After collapse outline from cell "2014", The element at "2", "0" in outline mode from grid view should have "collapsed" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellCollapseIconByPos('2', '0'))
            .toBe(true);
        const columnWidth = await reportGridView.getGridCellStyleByPos(0, 3, 'width');
        const columnWidthInt = parseInt(columnWidth);
        await reportGridView.resizeColumnByMovingBorder('3', 100, 'right');
        const columnWidthBefore = await reportGridView.getGridCellStyleByPos(0, 3, 'width');
        // remove px from columnWidthBefore and return int
        const columnWidthBeforeInt = parseInt(columnWidthBefore);
        await since(
            'After resize column by moving border, Column 3 is 100 pixels "more" in report editor, instead we have #{actual}'
        )
            .expect(columnWidthBeforeInt)
            .toBe(columnWidthInt + 100);
        await since(
            'After resize column by moving border, The element at "2", "0" in outline mode from grid view should have "collapsed" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellCollapseIconByPos('2', '0'))
            .toBe(true);
        await since(
            'After resize column by moving border, The element at "43", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('43', '0'))
            .toBe(true);
        await reportFormatPanel.enableStandardOutlineMode();
        await since(
            'After enable standard outline mode, The element at "2", "0" in outline mode from grid view should have "collapsed" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellCollapseIconByPos('2', '0'))
            .toBe(true);
        await since(
            'After enable standard outline mode, The element at "43", "0" in outline mode from grid view should have "collapsed" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellCollapseIconByPos('43', '0'))
            .toBe(true);
        await reportGridView.clickOutlineIconFromCH('Year');
        await since(
            'After click outline icon from "Year", The element at "2", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('2', '0'))
            .toBe(true);
        await since(
            'After click outline icon from "Year", The element at "43", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('43', '0'))
            .toBe(true);
        await since(
            'After click outline icon from "Year", The grid cell at "2", "0" has text "2014", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(2, 0))
            .toBe('2014');
        await since(
            'After click outline icon from "Year", The grid cell at "3", "1" has text "Central", instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellText(3, 1))
            .toBe('Central');
        await since(
            'After click outline icon from "Year", The grid cell at "4", "3" is not present, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellByPos('4', '3').isDisplayed())
            .toBe(false);

        await reportGridView.resizeColumnByMovingBorder(3, 25, 'left');
        const columnWidthAfter = await reportGridView.getGridCellStyleByPos(0, 3, 'width');
        const columnWidthAfterInt = parseInt(columnWidthAfter);
        await since(
            'After resize column by moving border, Column 3 is 25 pixels "less" than before, instead we have #{actual}'
        )
            .expect(await columnWidthAfterInt)
            .toBe(columnWidthBeforeInt - 25);
        await since(
            'After resize column by moving border, The element at "2", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('2', '0'))
            .toBe(true);
        await since(
            'After resize column by moving border, The element at "43", "0" in outline mode from grid view should have "expanded" icon, instead we have #{actual}'
        )
            .expect(await reportGridView.getGridCellExpandIconByPos('43', '0'))
            .toBe(true);
    });
});
