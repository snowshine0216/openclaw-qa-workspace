import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSDSort', () => {
    const document = {
        id: '6D4152BA406B4082CCCB73A69C713C13',
        name: 'Document sort',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '4993C4EA48A66125758A8084740C5CFA',
        name: 'Document sort on different grid template',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: '7BFE89CE4C046EA98D1374BCB0AEFC1C',
        name: 'Document sort on custom group',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: '91CB260C47F023FBA1B92EB2265845E4',
        name: 'Document sort with complex thresholding',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let { loginPage, libraryPage, dossierPage, rsdGrid, rsdGraph, transactionPage, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize(browserWindow);
        await loginPage.login(credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC76725] Library Web | Document Sort | Simple Sort on Grid | Sort from different entries (attribute header and metric header)', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);

        // sort descending on quarter
        const grid = rsdGrid.getRsdGridByKey('K35B4FB0944D95860DCF6F1B28FDA282A');
        await grid.rightClickCell('Year');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76725_01', 'menu without sort');
        await dossierPage.closePopupsByClickBlankPathinRsd();
        await grid.selectContextMenuOnCell('Quarter', 'Sort Descending');
        await since('The 7 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 2, 8))
            .toEqual(['2016 Q4', 'Atlanta', 'Books', 'USA', '20.10%', '$2,002', '$7,956']);
        await grid.rightClickCell('Quarter');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76725_02', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();

        // sort ascending on category
        await grid.selectContextMenuOnCell('Category', 'Sort Ascending');
        await since('The 7 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 2, 8))
            .toEqual(['2014 Q1', 'San Diego', 'Books', 'USA', '23.75%', '$2,855', '$9,166']);
        await grid.rightClickCell('Category');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76725_02', 'menu with sort ascending');
        await dossierPage.closePopupsByClickBlankPathinRsd();
        // sort descending on profit
        await grid.selectContextMenuOnCell('Profit', 'Sort Descending');
        await since('The 7 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 2, 8))
            .toEqual(['2016 Q4', 'New York', 'Electronics', 'USA', '16.21%', '$97,036', '$501,418']);
        await grid.rightClickCell('Profit');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76725_03', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();

        // sort ascending on Profit Margin
        const grid2 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid2.selectContextMenuOnCell('Profit Margin', 'Sort Ascending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 4))
            .toEqual(['2015', 'Memphis', 'Music', '3.16%']);
        await grid2.rightClickCell('Profit Margin');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76725_04', 'menu with sort ascending');
        await dossierPage.closePopupsByClickBlankPathinRsd();

        // check no sort on rsd graph
        await toc.openPageFromTocMenu({ chapterName: 'Graph-drill anywhere' });
        const graph = rsdGraph.findGraphByIdContains('kK2EFF52E84D31BABAD39DA1B3C4203F92');
        await graph.rightClickOnRectArea(['2014', 'San Diego', 'Electronics']);
        await takeScreenshot('TC76725_05', 'menu without sort');
        await since('The sort in RSD graph should be #{expected}, instead we have #{actual}')
            .expect(await graph.IsMenuPresentOnContextMenu(['2014', 'Atlanta', 'Electronics'], ['Sort']))
            .toBe(false);
    });

    it('[TC76862] Library Web | Document Sort | Simple Sort on Grid | Sort on Different grid template', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);

        // sort on grid all in row
        const grid = rsdGrid.getRsdGridByKey('WE3C64DC5926840A2B7DB4509A49BEE97');
        await grid.selectContextMenuOnCell('Country', 'Sort Descending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 4))
            .toEqual(['2014', 'Web', 'Profit', '$69,301']);
        await grid.rightClickCell('Country');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_01', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();

        // sort on grid all in column
        const grid2 = rsdGrid.getRsdGridByKey('W40ED02E416C44D0CA6C1A094FEDD2DBA');
        await grid2.selectContextMenuOnCell('Call Center', 'Sort Descending');
        await since('The 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 2))
            .toEqual(['Call Center', 'Web']);
        await grid2.rightClickCell('Call Center');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_02', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();
        await grid2.selectContextMenuOnCell('Cost', 'Sort Ascending');
        await since('The 2 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(4, 2, 3))
            .toEqual(['$67,630', '17.56%']);

        // sort on grid attribute in row, metric in column
        const grid3 = rsdGrid.getRsdGridByKey('W2FE53D08938F4BF3A3077C6E23B3E0B0');
        await grid3.selectContextMenuOnCell('Quarter', 'Sort Descending');
        await since('The 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid3.selectCellInOneRow(2, 1, 3))
            .toEqual(['Quarter', '2016 Q4', '2016 Q4']);
        await grid3.rightClickCell('Quarter');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_03', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();
        await grid3.rightClickCell('Profit');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_04', 'no menu on profit');
        await dossierPage.closePopupsByClickBlankPathinRsd();

        // sort on grid metric in row, attribute in column
        const grid4 = rsdGrid.getRsdGridByKey('W5FC3FA21EC1642F9877AAD95540BBFAD');
        await grid4.selectContextMenuOnCell('Year', 'Sort Descending');
        await since('The 4 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid4.selectCellInOneRow(4, 1, 4))
            .toEqual(['2016', 'Total', '$2,249,397', '15.14%']);
        await grid4.rightClickCell('Year');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_05', 'menu with sort descending');
        await dossierPage.closePopupsByClickBlankPathinRsd();
        await grid4.selectContextMenuOnCell('Profit Margin', 'Sort Ascending');
        await since('The 4 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid4.selectCellInOneRow(3, 1, 4))
            .toEqual(['2016', 'Web', '$358,700', '14.95%']);
        await grid4.rightClickCell('Profit Margin');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76862_06', 'menu with sort ascending');
        await dossierPage.closePopupsByClickBlankPathinRsd();
    });

    it('[TC76726] Library Web | Document Sort | Sort with total/sub total', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await toc.openPageFromTocMenu({ chapterName: 'Grid with total/sub total' });

        // sort on grid with total
        const grid = rsdGrid.getRsdGridByKey('W54C60C12D4294620BFFB9B238B321E52');
        await grid.selectContextMenuOnCell('Call Center', 'Sort Descending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 2, 5))
            .toEqual(['Web', '14.95%', '$583,538', '$3,319,225']);
        await grid.rightClickCell('Call Center');
        await takeScreenshot('TC76726_01', 'menu with sort descending');
        await grid.selectContextMenuOnCell('Cost', 'Sort Ascending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 2, 5))
            .toEqual(['Salt Lake City', '15.28%', '$111,779', '$619,634']);
        await grid.rightClickCell('Cost');
        await takeScreenshot('TC76726_02', 'menu with sort ascending');

        // sort on grid with subtotal
        const grid2 = rsdGrid.getRsdGridByKey('W1072DC3A4E41474BAA6A9B1B645446A8');
        await grid2.selectContextMenuOnCell('Quarter', 'Sort Descending');
        await since('The 4 cells of the 6th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(6, 2, 5))
            .toEqual(['Total', '13.65%', '$615,823', '$3,897,116']);
        await grid2.rightClickCell('Quarter');
        await takeScreenshot('TC76726_03', 'menu with sort descending');
        await grid2.selectContextMenuOnCell('Cost', 'Sort Ascending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 2, 5))
            .toEqual(['Books', '23.87%', '$29,756', '$94,913']);
        await grid2.scrollInGridToBottom();
        await dossierPage.waitForItemLoading(); // wait for subtotal loading
        await grid2.scrollInGridToBottom();
        await takeScreenshot('TC76726_04', 'subtotal with sort ascending');
    });

    it('[TC76861] Library Web | Sort X-Func |  Sort with threshold/drill/custom group', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        // sort on threshold grid
        await libraryPage.openDossier(document4.name);
        let grid = rsdGrid.getRsdGridByKey('K53');
        await grid.selectContextMenuOnCell('Revenue', 'Sort Ascending');
        await since('The 4 cells of the 5th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(5, 1, 4))
            .toEqual(['Electronics', '$1,030,923', '$753,421', '36.8%']);
        await takeScreenshot('TC76861_01', 'sort ascending with threshold');

        // sort on threshold grid with group by
        await transactionPage.groupBy.changeGroupBy('All');
        grid = rsdGrid.getRsdGridByKey('K53');
        await grid.selectContextMenuOnCell('Last Year\'s Revenue', 'Sort Descending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 4))
            .toEqual(['Electronics', '$1,030,923', '$753,421', '36.8%']);
        await takeScreenshot('TC76861_02', 'sort descending with threshold and group by');

        // sort on grid with drill
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document.name);
        const grid2 = rsdGrid.getRsdGridByKey('K2A6130D64AF1112276FD15A997815EF8');
        await grid2.selectContextMenuOnCell('Profit Margin', 'Sort Descending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 4))
            .toEqual(['2015', 'San Francisco', 'Books', '21.92%']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76861_03', 'sort descending');
        await grid2.selectContextMenuOnCell('2016', ['Drill', 'Quarter']);
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 4))
            .toEqual(['2016 Q1', 'Boston', 'Books', '24.21%']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76861_04', 'drill after sort descending');
        await grid2.selectContextMenuOnCell('Quarter', 'Sort Descending');
        await since('The 4 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 4))
            .toEqual(['2016 Q4', 'Atlanta', 'Books', '20.10%']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76861_05', 'sort descending after drill');

        // sort on grid with custom group
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document3.name);
        const grid3 = rsdGrid.getRsdGridByKey('W6B9C669BFBD2483BB9AA14BEDF5DC64F');
        await grid3.selectContextMenuOnCell('Revenue', 'Sort Descending');
        await since('The 6 cells of the 1st row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid3.selectCellInOneRow(2, 1, 6))
            .toEqual(['2016', '2016 Q4', 'Some Country', '$3,660,694', '$3,159,635', '$501,060']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC76861_06', 'sort descending with custom group');
    });
});

export const config = specConfiguration;
