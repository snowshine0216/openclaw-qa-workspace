import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_InformationWindow', () => {
    const document = {
        id: '6B991E0849DF370F80A03D8BAA0C7DBD',
        name: 'I_D2_Selector',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '0B38C80B4377D1EB2012D19870E9D681',
        name: 'I_D2_Selector_MultipleGraphs',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: 'E4B4C43F4267B6CB5A6E84A54E08E56C',
        name: 'I_D3_Nested_and_Grouping',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: '42BC61AF4F20F35829E4FFA03579B5AC',
        name: 'I_D4_Format_and_Context_menu_options',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document5 = {
        id: 'E945584A4329D75548C451AC0238290F',
        name: 'I_D5_Layouts_Viz_from_dossier',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document6 = {
        id: '9D1053964364FCDD1E677A8B1A3C554B',
        name: 'I_D6_Sections_and_Grouping',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document7 = {
        id: '450A032B44AFF770B26BCF9D9540EC6E',
        name: 'I_D8_S_Back_and_forth',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document8 = {
        id: '8EC48B51409D2F32A523DBB007E046E9',
        name: 'I_D8_S_Self_target',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document9 = {
        id: '7BD097BD479A4C35A7982A81B52D6AE8',
        name: 'I_D3_Nested',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document10 = {
        id: '97D1724B439ADCD9C496A68A285552B6',
        name: 'I_D5_Layouts',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document11 = {
        id: '5CD3F29F45FCFC9D50DB3DADE69BF276',
        name: 'I_D6_Sections',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document12 = {
        id: '68DE584740590D8F1691D0B30CEBCDC3',
        name: 'I_D7_View_Filter',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const { credentials } = specConfiguration;

    let dropdown, checkbox, radiobutton, listbox, buttonbar;

    let { loginPage, libraryPage, dossierPage, selectorObject, rsdGrid, toc, transactionPage, panelStack } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC74248_01] Validate selector can pass filter to grid in information window', async () => {
        dropdown = selectorObject.dropdown;
        checkbox = selectorObject.checkbox;
        radiobutton = selectorObject.radiobutton;
        buttonbar = selectorObject.buttonbar;
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await libraryPage.openDossier(document.name);
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Movies');
        await checkbox.clickItems(['2015', '2016']);
        await radiobutton.selectItemByText('Action');
        // Open information window
        await dossierPage.clickBtnByTitle('Info Window');
        // Check: Grid data in IW
        const grid = rsdGrid.getRsdGridByKey('W47');
        await since('The first 3 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(4, 1, 3))
            .toEqual(['2016 Q3', 'Movies', 'Action']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_01', 'IW for movies, 2016 and Action');
        await panelStack.closeInfoWindow();
        await buttonbar.selectItemByText('Q3');
        await dossierPage.clickBtnByTitle('Info Window');
        await since('The first 3 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(4, 1, 3))
            .toEqual(['2016 Q4', 'Movies', 'Action']);
        await takeScreenshotByElement(
            dossierPage.getDocView(),
            'TC74248_02',
            'IW for movies, 2016, Action and except 2016 Q3'
        );
        await panelStack.closeInfoWindow();
    });

    it('[TC74248_02] Validate grid can pass filter to multi graph in information window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await libraryPage.openDossier(document2.name);
        // Open information window from grid element
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('Books');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_03', 'IW for books');
        await panelStack.closeInfoWindow();
        await grid.clickCell('Music');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_04', 'IW for music');
        await panelStack.closeInfoWindow();
    });

    it('[TC74248_03] Validate nested information window in RSD with grouping', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document3.name);
        await transactionPage.groupBy.changeGroupBy('2015');
        // Open information window from grid element
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('South');
        await dossierPage.waitForDossierLoading();
        const grid2 = rsdGrid.getRsdGridByKey('W52');
        await since('The first 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(3, 1, 3))
            .toEqual(['Books', 'Business', '$4,362']);
        await grid2.clickCell('Books');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_05', 'open IWB from books');
    });

    it('[TC74248_04] Validate Format and Context menu options in information window', async () => {
        listbox = selectorObject.listbox;
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await libraryPage.openDossier(document4.name);
        // Open information window from grid element
        const grid = rsdGrid.getRsdGridByKey('K44');
        await grid.clickCell('2015');
        await dossierPage.waitForDossierLoading();
        await listbox.selectItemByText('Books');
        await dossierPage.waitForDossierLoading();
        let grid2 = rsdGrid.createNthGrid(1);
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 3))
            .toEqual(['2015', 'Books', '$187,027']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_06', 'IW for 2015');
        // Close infoWindow by click other place
        await toc.openMenu();
        await toc.closeMenu({ icon: 'close' });
        // Open information window from grid element in panel
        const grid3 = rsdGrid.getRsdGridByKey('W49');
        await grid3.clickCell('2014');
        await dossierPage.waitForDossierLoading();
        await listbox.selectNthItem(1, 'All');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_07', 'IW for 2014');
        if (libraryPage.isSafari()) {
            // click the cell before opening the context menu, make sure right click will work
            await grid2.clickCell('Profit');
        }
        // open Context menu options
        grid2 = rsdGrid.createNthGrid(1);
        await grid2.selectGridContextMenuOption('Profit', 'Sort Ascending');
        await dossierPage.waitForDossierLoading();
        // Check: Grid data after sort descending
        await since('The first 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 3))
            .toEqual(['2014', 'Music', '$44,215']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_08', 'Sort Descending in IW');
    });

    it('[TC74248_05] Validate information window converted from dossier', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await libraryPage.openDossier(document5.name);
        // Open information window from text
        await dossierPage.clickTextfieldByTitle('Open Info Window');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_09', 'IW open from text');
        // Switch layout
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Bar graph dossier converted RSD' });
        await takeScreenshot('TC74248_12', 'Viz converted from dossier', { tolerance: 0.11 });
        // Switch layout
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 1' });
        await dossierPage.clickTextfieldByTitle('Open Info Window');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_10', 'IW open from text after switch layout');
    });

    it('[TC74248_06] Validate information window in multi section with grouping', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document6,
        });
        await libraryPage.openDossier(document6.name);
        await transactionPage.groupBy.changeGroupBy('All');
        const grid = rsdGrid.createNthGrid(2);
        // Open information window from grid
        await grid.clickCell('20K-30K');
        await dossierPage.waitForDossierLoading();
        const grid3 = rsdGrid.getRsdGridByKey('W57');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid3.selectCellInOneRow(2, 1, 2))
            .toEqual(['Central', '20K-30K']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_11', 'IW for 20K-30K');
        const grid4 = rsdGrid.createNthGrid(4);
        await grid4.clickCell('30K-40K');
        await dossierPage.waitForDossierLoading();
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid3.selectCellInOneRow(2, 1, 2))
            .toEqual(['Central', '30K-40K']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_12', 'IW for 30K-40K');
        // Change group
        await transactionPage.groupBy.changeGroupBy('Over 100K');
        const grid2 = rsdGrid.getRsdGridByKey('W54');
        await grid2.clickCell('Over 100K');
        await dossierPage.waitForDossierLoading();
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid3.selectCellInOneRow(2, 1, 2))
            .toEqual(['Central', 'Over 100K']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_13', 'IW for Over 100K');
        // Change group
        await transactionPage.groupBy.changeGroupBy('20K and Under');
        await grid2.clickCell('20K and Under');
        await dossierPage.waitForDossierLoading();
        const grid33 = rsdGrid.getRsdGridByKey('W57');
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid33.selectCellInOneRow(2, 1, 2))
            .toEqual(['Central', '20K and Under']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_14', 'IW for 20K and Under');
        // Change group
        await transactionPage.groupBy.changeGroupBy('60K-70K');
        await grid2.clickCell('60K-70K');
        await dossierPage.waitForDossierLoading();
        await since('The first 2 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid33.selectCellInOneRow(2, 1, 2))
            .toEqual(['Central', '60K-70K']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_15', 'IW for 60K-70K');
    });

    it('[TC74248_07] Validate back and forth of information window', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document7.name);
        const grid = rsdGrid.getRsdGridByKey('W46');
        // Open information window from grid
        await grid.clickCell('Central');
        await dossierPage.waitForDossierLoading();
        const regionPanel = panelStack.create('Region panel');
        await since('Region Panel display should be #{expected}, instead we have #{actual}')
            .expect(await regionPanel.getContent().isDisplayed())
            .toBe(true);
        // Open information window from text
        await dossierPage.clickTextfieldByTitle('to Year Panel');
        await dossierPage.waitForDossierLoading();
        const yearPanel = panelStack.create('Year panel');
        await since('Year Panel display should be #{expected}, instead we have #{actual}')
            .expect(await yearPanel.getContent().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_16', 'Forth of IW');
        // Back to region panel
        await dossierPage.clickTextfieldByTitle('Central');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_17', 'Back of IW');
        // Go to year panel again
        await dossierPage.clickTextfieldByTitle('to Year Panel');
        await dossierPage.waitForDossierLoading();
        await since('Year Panel display should be #{expected}, instead we have #{actual}')
            .expect(await yearPanel.getContent().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_18', 'Forth again of IW');
        // Go to region panel again
        await dossierPage.clickTextfieldByTitle('to Region panel');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_19', 'Forth twice of IW');
    });

    it('[TC74248_08] Validate information window with self target', async () => {
        dropdown = selectorObject.dropdown;
        await resetDossierState({
            credentials: credentials,
            dossier: document8,
        });
        await libraryPage.openDossier(document8.name);
        const grid = rsdGrid.getRsdGridByKey('W64');
        // Open information window from grid
        await grid.clickCell('Mid-Atlantic');
        await dossierPage.waitForDossierLoading();
        const panel = panelStack.create('Panel Stack65');
        await since('Panel66 display should be #{expected}, instead we have #{actual}')
            .expect(await panel.getContent().isDisplayed())
            .toBe(true);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_20', 'IW open from Mid-Atlantic');
        // Change panel
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Panel67');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_21', 'IW open from itself');
        await panelStack.closeInfoWindow();
    });

    it('[TC74248_09] Validate information window with self target', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document9,
        });
        await libraryPage.openDossier(document9.name);
        await dossierPage.clickTextfieldByTitle('Open Info Window 1');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Open InfoWindow 3');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_22', 'open IW3 from IW1');
        await panelStack.closeInfoWindow();
        await dossierPage.clickTextfieldByTitle('Open Info Window 2');
        await dossierPage.waitForDossierLoading();
        await dossierPage.clickTextfieldByTitle('Open InfoWindow 3');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_23', 'open IW3 from IW2');
    });

    it('[TC74248_10] Validate information window in multi layout', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document10,
        });
        await libraryPage.openDossier(document10.name);
        await dossierPage.clickTextfieldByTitle('Selections');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_24', 'IW in Effectiveness layout');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Selections' });
        await dossierPage.clickTextfieldByTitle('Selections');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_25', 'IW in Selections layout');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Handling' });
        await dossierPage.clickTextfieldByTitle('Selections');
        await takeScreenshot('TC74248_26', 'IW in Handling layout');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Capacity' });
        await dossierPage.clickTextfieldByTitle('Selections');
        await takeScreenshot('TC74248_27', 'IW in Capacity layout');
    });

    it('[TC74248_11] Validate information window in multi layout', async () => {
        dropdown = selectorObject.dropdown;
        await resetDossierState({
            credentials: credentials,
            dossier: document11,
        });
        await libraryPage.openDossier(document11.name);
        await dossierPage.clickTextfieldByTitle('SHOW PANEL STACK');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_26', 'IW open from book section');
        await panelStack.closeInfoWindow();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Electronics');
        await dossierPage.clickTextfieldByTitle('SHOW PANEL STACK');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_27', 'IW open from Electronics section');
        await panelStack.closeInfoWindow();
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Movies');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_28', 'Movies section');
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Music');
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_29', 'Music section');
    });

    it('[TC74248_12] Validate information window with view filter', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document12,
        });
        await libraryPage.openDossier(document12.name);
        const grid = rsdGrid.getRsdGridByKey('W46');
        await grid.clickCell('Books');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_30', 'IW for books');
        await grid.clickCell('Electronics');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_31', 'IW for Electronics');
        await grid.clickCell('Movies');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_32', 'IW for Movies');
        await grid.clickCell('Music');
        await dossierPage.waitForDossierLoading();
        await dossierPage.waitForInfoWindowLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC74248_33', 'IW for Music');
    });
});

export const config = specConfiguration;
