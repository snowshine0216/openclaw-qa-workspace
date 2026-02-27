import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_RSD') };

describe('RSD_General', () => {
    const document = {
        id: 'E021FDCB488571D192BCB3BBC4D0691A',
        name: 'Test Document with Empty Section no Shrink no hide if empty with fit width',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document2 = {
        id: '3656BA9A4FF7081DEB6EB1A58B01439E',
        name: 'Test Document with Empty Section no Shrink with zoom 50%',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document3 = {
        id: '78B9800E4E339A57713DD983084537DA',
        name: 'Test Document with Empty Section can Shrink and hide if empty',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document4 = {
        id: 'BA2F7065484D9EF8701DBC94DC09FC9E',
        name: 'TC65322-htmlTextToImage',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document5 = {
        id: 'D16B4BA34BC5CA0F481543B2112B3A32',
        name: 'TC65322-iframeToReportShareLink',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document6 = {
        id: '06B1B88342D2D34EDF298494EBD29218',
        name: 'RSD image effects',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document7 = {
        id: '0DF666CB46260712953459B7958EDAED',
        name: 'RSD image borders',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document8 = {
        id: '3BD9452044ADE7C15F7CD19889BF6018',
        name: 'Document with Line and Shape',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document9 = {
        id: 'D5F928C64885B8BA336C5CB81F2B5850',
        name: 'document with Text Box using different Effects',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document10 = {
        id: '4CEAA8614EA8C19517323287D7F286D5',
        name: 'document with textbox using different number format',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document11 = {
        id: 'BCD740D7447FE92A22E6FCA8DD554473',
        name: 'Document with complex thresholding',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document12 = {
        id: '82AA00584F9DEBD88DE3C09AEEAE80EA',
        name: '(Auto)_CSP',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document13 = {
        id: '4D7AEF6442EAE6AF0C3004B48A7E3909',
        name: 'California Population Analysis',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document14 = {
        id: '1F7F722542875851163F16A973B48E46',
        name: 'Support Center Dashboard',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document15 = {
        id: 'C0207C1811EA2592F7BD0080EF058513',
        name: 'Test TC58938',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document16 = {
        id: 'F0B00B6E4EC5FEA9711CB78AD7294882',
        name: 'TC65322-iframeToGoogle',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document17 = {
        id: 'DE7150404450AE12563D249A1C8682D3',
        name: 'TC65322-iframeToImage',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document18 = {
        id: '240A82C24BD7326116BC7A962BB88377',
        name: 'TC2556',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document19 = {
        id: '2DEE6E004FB7961BD32D3FAC9EA9AA80',
        name: 'TC56272',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const document20 = {
        id: '76EC3BDF43C9205F5E47E39C9CA9A54E',
        name: 'TC64064-HTML containers',
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

    let linkbar, dropdown, slider;

    let {
        loginPage,
        libraryPage,
        dossierPage,
        promptEditor,
        rsdGrid,
        transactionPage,
        selectorObject,
        panelStack,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(credentials);

        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC71359_01] Validate zoom in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document2,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document3,
        });
        await libraryPage.openDossier(document.name);
        const grid = rsdGrid.getRsdGridByKey('W28E2F214F07E4FEFBF84EEDA2389C53A');
        await since('The 2 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['20K-30K', '$417,754']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_01', 'rsd with fit width');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document2.name);
        await since('The 2 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(4, 1, 3))
            .toEqual(['30K-40K', '$310,503']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_02', 'rsd with zoom 50%');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document3.name);
        await since('The 2 cells of the 5th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(5, 1, 3))
            .toEqual(['40K-50K', '$824,686']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_03', 'rsd with fit page');
    });

    it('[TC71359_02] Validate HTML container in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document4,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document5,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document16,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document17,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document18,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document19,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document20,
        });
        await libraryPage.openDossier(document4.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_04', 'rsd with HTML image');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document5.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with iframe shared link', {
            tolerance: 0.5,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document16.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with iframe bing link', {
            tolerance: 2,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document17.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with iframe image', {
            tolerance: 0.5,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document18.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with diff html text', {
            tolerance: 0.5,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document19.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with diff html color', {
            tolerance: 0.5,
        });
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document20.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_05', 'rsd with diff html space', {
            tolerance: 0.5,
        });
    });

    it('[TC71359_03] Validate image in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document6,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document7,
        });
        await libraryPage.openDossier(document6.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_06', 'rsd with different image effects');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document7.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_07', 'rsd with different image borders');
    });

    it('[TC71359_04] Validate line and shape in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document8,
        });
        await libraryPage.openDossier(document8.name);
        const grid = rsdGrid.getRsdGridByKey('W44');
        await since('The 3 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 3))
            .toEqual(['Business', '$ 11', '$ 235']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_08', 'rsd with different line');
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        const grid2 = rsdGrid.getRsdGridByKey('W129');
        await since('The 2 cells of the 4th row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(4, 1, 2))
            .toEqual(['Literature', '$ 6']);
        await takeScreenshot('TC71359_09', 'rsd with different shape', { tolerance: 0.16 });

        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 3' });
        await takeScreenshot('TC71359_10', 'rsd with different line in panel');
    });

    it('[TC71359_05] Validate text in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document9,
        });
        await resetDossierState({
            credentials: credentials,
            dossier: document10,
        });
        await libraryPage.openDossier(document9.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_11', 'rsd with different text effects');
        await dossierPage.goToLibrary();
        await libraryPage.openDossier(document10.name);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_12', 'rsd with different number format');
    });

    it('[TC71359_06] Validate thresdhold in rsd', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document11,
        });
        await libraryPage.openDossier(document11.name);
        const grid = rsdGrid.getRsdGridByKey('K53');
        await since('The 4 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 4))
            .toEqual(['Electronics', '$1,030,923', '$753,421', '36.8%']);
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_13', 'rsd with thresdhold', {
            tolerance: 0.5,
        });
        await transactionPage.groupBy.changeGroupBy('Dec 2016');
        await dossierPage.waitForDossierLoading();
        const grid2 = rsdGrid.getRsdGridByKey('K53');
        await since('The 4 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(3, 1, 4))
            .toEqual(['Electronics', '$1,076,885', '$761,289', '41.5%']);
    });

    // it('[TC71359_07] Verify document selector and grid sanity function', async () => {
    //     await resetDossierState({
    //         credentials: credentials,
    //         dossier: document13
    //     });
    //     await libraryPage.openDossier(document13.name);
    //     await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_14', 'DocumentInitialRendering', {tolerance: 0.2});

    //     await selector.listbox.selectItemByText('CALAVERAS');
    //     await since('CALAVERAS should be selected')
    //         .expect(selector.listbox.isItemExisted('CALAVERAS')).toBe(true);
    //     await selector.radiobutton.selectItemByText('Population');
    //     await since('Population should be selected')
    //         .expect(selector.radiobutton.isItemExisted('Population')).toBe(true);
    //     await dossierPage.waitForDossierLoading();
    //     await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_15', 'AfterChangeSelector', {tolerance: 0.2});

    //     await selector.radiobutton.selectItemByText('Education');
    //     await since('Education should be selected')
    //         .expect(selector.radiobutton.isItemExisted('Education')).toBe(true);
    //     // Change grid/graph view
    //     const gridAndGraph = rsdPage.findGridAndGraphByName(browserInstance,'GridGraph Commute');
    //     await gridAndGraph.showQuickSwitch();
    //     await gridAndGraph.switchModeToGrid(false);
    //     await dossierPage.waitForDossierLoading();
    //     await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_16', 'ChangetoGridView', {tolerance: 0.2});
    //     await gridAndGraph.showQuickSwitch();
    //     await gridAndGraph.switchModeToGraph(false);
    //     await dossierPage.waitForDossierLoading();
    //     await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_17', 'ChangetoGraphView', {tolerance: 0.2});
    // });

    it('[TC71359_08] Verify document selector and grid sanity function', async () => {
        linkbar = selectorObject.linkbar;
        dropdown = selectorObject.dropdown;
        slider = selectorObject.slider;
        await resetDossierState({
            credentials: credentials,
            dossier: document14,
        });
        await libraryPage.openDossier(document14.name);
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_18', 'DocumentInitialRendering', {
            tolerance: 0.2,
        });

        await linkbar.selectNthItem(3, 'Product Adoption');
        await slider.dragSlider({ x: 104, y: 0 }, 'top');
        await dropdown.openDropdown();
        await dropdown.selectItemByText('Open Cases EOM');
        await dossierPage.waitForDossierLoading();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_19', 'ChangeSelector', { tolerance: 0.2 });
    });

    it('[TC71359_09] Multi_Layouts on Document', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document15,
        });
        await libraryPage.openDossier(document15.name);
        await promptEditor.run();
        await dossierPage.waitForDossierLoading();
        await transactionPage.groupBy.changeGroupBy('2015');
        const grid = rsdGrid.getRsdGridByKey('K44');
        await since('The 2 cells of the 3rd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(3, 1, 2))
            .toEqual(['Central', '$1,667,004']);
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 2' });
        await toc.openMenu();
        await toc.goToPage({ chapterName: 'Layout 3' });
        await dossierPage.clickBtnByTitle('Open Information Window');
        const grid2 = rsdGrid.getRsdGridByKey('W146');
        await since('The 3 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid2.selectCellInOneRow(2, 1, 3))
            .toEqual(['Northeast', '$ 1,161,311', '$1,343,717']);
        await panelStack.closeInfoWindow();
        await dossierPage.clickBtnByTitle('Link to Document');
        await dossierPage.switchToNewWindow();
        await promptEditor.run();
        await takeScreenshotByElement(dossierPage.getDocView(), 'TC71359_22', 'target rsd', { tolerance: 0.2 });
        await dossierPage.closeTab(1);
    });

    it('[TC88510] Validate E2E CSP - remove eval works fine', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: document12,
        });
        await libraryPage.openDossier(document12.name);
        let grid = rsdGrid.getRsdGridByKey('W61E9DDF03E2B45FFA7F42BCC91201E2C');
        await since('The 4 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 8))
            .toEqual(["\\'", 'U+001F', '\\u{43}', '\\x41', '\\1', '\\8', '\\<LF>', '\\A']);

        await transactionPage.groupBy.changeGroupBy('All');
        await dossierPage.waitForDossierLoading();
        grid = rsdGrid.getRsdGridByKey('W61E9DDF03E2B45FFA7F42BCC91201E2C');
        await since('The 4 cells of the 2nd row in grid should be #{expected}, instead we get #{actual}')
            .expect(await grid.selectCellInOneRow(2, 1, 8))
            .toEqual(["\\'", 'U+001F', '\\u{43}', '\\x41', '\\1', '\\8', '\\<LF>', '\\A']);
    });
});

export const config = specConfiguration;
