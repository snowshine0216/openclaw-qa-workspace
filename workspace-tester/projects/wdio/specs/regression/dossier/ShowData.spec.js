import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { isFileNotEmpty } from '../../..//config/folderManagement.js';

describe('Show Data', () => {
    const dossier = {
        id: '3C84BA0549994604D8D168A88B685BF2',
        name: 'Show data',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    const dossierExcelFile = {
        name: dossier.name,
        fileType: '.xlsx',
    };
    const dossierCsvFile = {
        name: dossier.name,
        fileType: '.csv',
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        loginPage,
        baseVisualization,
        checkboxFilter,
        dossierPage,
        filterPanel,
        grid,
        libraryPage,
        inCanvasSelector,
        pdfExportWindow,
        showDataDialog,
        toc,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);

        await setWindowSize(browserWindow);
    });

    beforeEach(async () => {
        await resetDossierState({
            credentials: browsers.params.credentials,
            dossier,
        });
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC66262] Verify end-to-end Show Data functionality', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Normal Grid');
        await showDataDialog.clickAddDataButton();
        await showDataDialog.addElementToDataset({ title: 'Metrics', elem: 'Profit' });

        await showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();

        //await showDataDialog.clickShowDataExportButton();
        // await showDataDialog.exportShowData('PDF');
        // await pdfExportWindow.exportSubmitVisualization();
        // Wait the file to be comp

        // since(`The pdf file for ${dossier.name} was not downloaded`)
        //     .expect(await isFileNotEmpty(dossierPdfFile)).toBe(true);
        // await deleteFile(dossierPdfFile);

        await showDataDialog.clickShowDataCloseButton();

        await baseVisualization.selectShowDataOnVisualizationMenu('Pie Chart');

        await showDataDialog.clickAddDataButton();
        await showDataDialog.addElementToDataset({ title: 'Attributes', elem: 'Year' });

        await showDataDialog.clickAddDataOkButton();
        await dossierPage.waitForPageLoading();
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(48);
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC57256] Verify that Show Data window can be used effectively by Library end-users with a compound baseVisualization', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Compound Grid' });
        await baseVisualization.hover({ elem: baseVisualization.getVisualizationMenuButton('Visualization 1') });
        await baseVisualization.openVisualizationMenu({
            elem: baseVisualization.getVisualizationMenuButton('Visualization 1'),
        });
        since('Show data has not supported compound baseVisualization yet, the show data option should present')
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 0, option: 'Show Data' }))
            .toBe(true);
        await baseVisualization.clickMenuOptionInLevel({
            level: 0,
            option: 'Show Data',
        });
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(192);

        await showDataDialog.selectColumnSetOption('Column Set 3');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(48);
        await showDataDialog.clickShowDataCloseButton();

        await grid.selectGridContextMenuOption({
            title: 'Visualization 1',
            headerName: 'Category',
            elementName: 'Books',
            firstOption: 'Show Data...',
        });
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(48);
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC55273] Verify that Show Data window can be used effectively by Library end-users when using different types of visualizations (i.e. charts, graphs)', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Normal Grid');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(192);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Pie Chart');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Area Chart');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(8);
        await showDataDialog.clickShowDataCloseButton();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Visualizations 1' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Line Chart');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(32);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Sunburst');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(8);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Heat map');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('KPI');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(32);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Word Cloud');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);
        await showDataDialog.clickShowDataCloseButton();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Visualizations 2' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Bubble Chart');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(24);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Combo Chart');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(8);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Network');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(32);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Waterfall');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(8);
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC55274] Verify that Show Data window can be used effectively by Library end-users for visualizations with special features (i.e. thresholds, totals)', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Grid with Threshold');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(21);
        await showDataDialog.clickShowDataCloseButton();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Grid Outline mode' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Grid Outline Mode');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(29);
        await showDataDialog.clickShowDataCloseButton();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Customized Grid' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Column Header');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Column Header - without metric');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Column Header - without attribute');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Column Header - metrics in row');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Row Header');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Row Header - without metric');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Row Header - without attribute');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(1);
        await showDataDialog.clickShowDataCloseButton();
        await baseVisualization.selectShowDataOnVisualizationMenu('Hide Row Header - metrics in row');
        since('There should be #{expected} rows in dataset, instead we have #{actual} rows')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(4);
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC58429] Verify that Show Data window can be used effectively by Library end-users for dossier with Filter', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Category');
        await checkboxFilter.selectElementByName('Electronics');
        await filterPanel.apply();
        await baseVisualization.selectShowDataOnVisualizationMenu('Pie Chart');
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC58606] Verify that Show Data window can be used effectively by Library end-users for visualizations with target and in-canvas selector', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await inCanvasSelector.selectItem('Year');
        await baseVisualization.selectShowDataOnVisualizationMenu('Area Chart');
        await showDataDialog.clickShowDataCloseButton();
        await grid.selectGridElement({
            title: 'Normal Grid',
            headerName: 'Year',
            elementName: '2015',
        });
        await baseVisualization.selectShowDataOnVisualizationMenu('Area Chart');
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC55275] Verify that Show Data window can be used effectively by Library end-users to read through on a grid and perform manipulations to that grid (i.e. sort, scroll)', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Pie Chart');
        await showDataDialog.sortByColumnHeader('Subcategory');
        await showDataDialog.scrollDatasetToBottom();
        await showDataDialog.clickShowDataCloseButton();
    });

    it('[TC55278] Verify that Show Data window can be used effectively by Library end-users to export data to Excel, PDF or CSV file', async () => {
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Overview' });
        await baseVisualization.selectShowDataOnVisualizationMenu('Normal Grid');
        // await showDataDialog.clickShowDataExportButton();
        // await showDataDialog.exportShowData('PDF');
        // await pdfExportWindow.exportSubmitVisualization();
        // await pdfExportWindow.waitForExportComplete(dossierPdfFile);
        // since(`The pdf file for ${dossier.name} was not downloaded`)
        //     .expect(await isFileNotEmpty(dossierPdfFile)).toBe(true);
        // await deleteFile(dossierPdfFile);

        await showDataDialog.clickShowDataExportButton();
        await showDataDialog.exportShowData('Data');
        await pdfExportWindow.waitForExportComplete(dossierCsvFile);
        since(`The csv file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierCsvFile))
            .toBe(true);

        await showDataDialog.clickShowDataExportButton();
        await showDataDialog.exportShowData('Excel');
        await pdfExportWindow.waitForExportComplete(dossierExcelFile);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty(dossierExcelFile))
            .toBe(true);

        await showDataDialog.clickShowDataCloseButton();
    });
});
