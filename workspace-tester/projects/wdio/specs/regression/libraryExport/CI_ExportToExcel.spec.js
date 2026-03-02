import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshot, takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { isFileNotEmpty, getFileSize, deleteFile } from '../../../config/folderManagement.js';


describe('Export - Export Grids to Excel', () => {
    const dossier = {
        id: '20337AE44BFADA7681F668AC2619E74B',
        name: '(AUTO) Export to Excel',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const dossier2 = {
        id: 'B54AA1DD441277847CBFB69F7ED14F14',
        name: '(AUTO) Export Entire Dossier to Excel',
        project: {
            id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
            name: 'MicroStrategy Tutorial'
        }
    };

    const browserWindow = {
        browserInstance: browsers.browser1,
        width: 1400,
        height: 1000
    };

    let {
		baseVisualization,
		dossierPage,
		excelExportPanel,
		hamburgerMenu,
		libraryPage,
		share,
		toc,
		infoWindow,
		loginPage,
	} = browsers.pageObj1;

    let mockedExcelRequest;

    beforeAll(async () => {
        await loginPage.login(browsers.params.credentials);
        await setWindowSize(browserWindow);
        mockedExcelRequest = await browser.mock('https://**/excel');
    });

    afterEach(async() =>{
        await dossierPage.goToLibrary();
        mockedExcelRequest.clear();
    });

    // [TC76451_SharePanel] Export entire dossier to Excel in Library
    // 1. Open dossier
    // 2. Click share icon to open share panel
    // 3. Check if button "Export to Excel" is enabled
    // 4. Click button "Export to Excel" to open export settings
    // 5. Change range to "Entire dossier"
    // 6. Click Export button and check if the excel file is downloaded successfully
    it('[TC76451_SharePanel] Export entire dossier to Excel in Library', async() => {
        await deleteFile({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier2.name);
        await libraryPage.openDossier(dossier2.name);
        await dossierPage.openShareDropDown();
        await share.clickExportToExcel();
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickCheckboxByPageName('(All)');
        await excelExportPanel.clickCheckboxByPageName('(All)');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC76451_SharePanel', 'Export Excel dialog', {tolerance: 0.3});
        await excelExportPanel.openExcelRangeSetting();
        await excelExportPanel.clickExportButton();
        await share.waitForDownloadComplete({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'});
        since(`The excel file for ${dossier2.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'})).toBe(true);
		const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
        since('Entire dossier is exported, it is supposed to be #{expected}, instead we have #{actual}.')
            .expect(postData.pageOption).toEqual("ALL");
        await libraryPage.reload();
    });


    // [TC76451_InfoWindow] Export entire dossier to Excel in Library
    // 1. Open info window
    // 2. Click button "Export to Excel"
    // 3. Check if the excel file is downloaded successfully
    it('[TC76451_InfoWindow] Export entire dossier to Excel in Library', async() => {
        await deleteFile({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier2.name);
        await libraryPage.openDossierInfoWindow(dossier2.name);
        await infoWindow.clickExportExcelButton();
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isLibraryExportExcelWindowOpen()).toBe(true);
        await excelExportPanel.clickLibraryExportButton();
        await infoWindow.sleep(3000);
        await infoWindow.waitForDownloadComplete({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'});
        since(`The excel file for ${dossier2.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export Entire Dossier to Excel',fileType:'.xlsx'})).toBe(true);
		const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
		since('Entire dossier is exported, it is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.pageOption).toEqual("ALL");
        await libraryPage.reload();
    });




    // [TC74132] Export grid in panel stack to Excel from Library
    // 1. Switch to page which contains grids in panel stack
    // 2. Click share icon to open share panel
    // 3. Check if Export Grid to Excel button enable
    // 4. Click Export Grid to Excel button to open grid list
    // 5. Check if All grids been selected and if Export button enable
    // 6. Uncheck "Long grid" and check if Export button enable
    // 7. Select "Grid 1" only and check if Export button enable
    // 8. Select "(All)" and check if Export button enable
    // 9. Click export button and check if the excel file download successfully

    it('[TC74132] Export grid in panel stack to Excel from Library', async() => {
        await deleteFile({name:'(AUTO) Export to Excel_panelstack',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        // Switch to page which contains grids in panel stack
        await toc.openMenu();
        await toc.goToPage({chapterName:'panelstack_gridexpansion',pageName:'panelstack'});
        // Click share icon to open share panel and check if Export Grid to Excel button enable
        await dossierPage.openShareDropDown();
        since('The page contains more than one grids, the export to excel icon disabled is supposed to be {expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        // Click Export Grid to Excel button to open grid list and check if All grids been selected and if Export button enable
        await share.clickExportToExcel();
		await excelExportPanel.selectExcelContents('Each visualization separately');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC74132_m2021', 'Grid list', {tolerance: 0.3});
        // Uncheck "Long grid" and check if Export button enable
        await excelExportPanel.selectGrid('Long grid');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshot('TC74132_m2021', 'Disable Long grid', {tolerance: 0.3});
        // Select "Grid 1" only and check if Export button enable
        await excelExportPanel.selectGridOnly('Grid 1');
        since('There is still grid checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshot('TC74132_m2021', 'Grid 1 only', {tolerance: 0.3});
        // Select "(All)" and check if Export button enable
        await excelExportPanel.selectGrid('(All)');
        since('All grids are checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshot('TC74132_m2021', 'Check all', {tolerance: 0.3});
        await excelExportPanel.selectGrid('RING');
        await excelExportPanel.clickExportButton();
        await share.waitForDownloadComplete({name:'(AUTO) Export to Excel_panelstack',fileType:'.xlsx'});
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_panelstack',fileType:'.xlsx'})).toBe(true);
		const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
		since('The specific grids are exported, it is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.keys).toEqual(["K131", "K146", "K139"]);
        await libraryPage.reload();
    });

    // entry point: from share

    // [TC61649] Export to Excel - Verify export grid to Excel from end to end
    // 1. Click share icon to open share panel
    // 2. Check if Export Grid to Excel button enable
    // 3. Click Export Grid to Excel button to open grid list
    // 4. Check if any grid been selected and if Export button enable
    // 5. Select empty grid and check if Export button enable
    // 6. Select "Normal grid" and check if Export button enable
    // 7. Click export button and check if the excel file download successfully

    it('[TC61649] Export to Excel - Verify export grid to Excel from end to end', async() => {
        await deleteFile({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openMenu();
        await toc.goToPage({chapterName:'Chapter 1',pageName:'Overview'});
        await dossierPage.openShareDropDown();
        since('The page contains more than one girds, the export to excel icon disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61649_m2021', 'Grid list');
        await excelExportPanel.selectGrid('Empty Grid');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await excelExportPanel.selectGridOnly('Normal Grid');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61649_m2021', 'Select Normal Grid', {tolerance: 0.3});
        await excelExportPanel.clickExportButton();
        await share.waitForDownloadComplete({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'})).toBe(true);

		const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
		since('The specific grid is exported, it is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.keys).toEqual(['W62']);
        await libraryPage.reload();
    });

    // entry point: from share, export multiple grid

    // [TC65772] Export multiple grids to Excel - Verify export grid to Excel from end to end
    // 1. Click share icon to open share panel
    // 2. Check if Export Grid to Excel button enable
    // 3. Click Export Grid to Excel button to open grid list
    // 4. Check if All grids been selected and if Export button enable
    // 5. Uncheck "Empty grid" and check if Export button enable
    // 6. Select "Compound grid" only and check if Export button enable
    // 7. Uncheck "Compoun grid" and check if Export button enable
    // 8. Select "Empty grid" and check if Export button enable
    // 9. Select "(All)" and check if Export button enable
    // 10. Click export button and check if the excel file download successfully

    it('[TC65772] Export to Excel - Verify export grid to Excel from end to end', async() => {
        await deleteFile({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openMenu();
        await toc.goToPage({chapterName:'Chapter 1',pageName:'Overview'});
        await dossierPage.openShareDropDown();
        since('The page contains more than one grids, the export to excel icon disabled is supposed to be {expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC65772_m2021', 'Grid list', {tolerance: 0.3});
        await excelExportPanel.selectGrid('Empty Grid');
        since('There are still grids checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await excelExportPanel.selectGridOnly('Compound Grid');
        since('There is still grid checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await excelExportPanel.selectGrid('Compound Grid');
        since('There is no grid checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(true);
        await excelExportPanel.selectGrid('Empty Grid');
        since('The grid is empty, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC65772_m2021', 'Empty grid', {tolerance: 0.3});
        await excelExportPanel.selectGrid('(All)');
        since('All grids are checked, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC65772_m2021', 'Check all', {tolerance: 0.3});
        await dossierPage.sleep(3000);
        await excelExportPanel.clickExportButton();
        await dossierPage.sleep(3000);
        await share.waitForDownloadComplete({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'})).toBe(true);

		const postData = excelExportPanel.getRequestPostData(mockedExcelRequest.calls[0]);
		since('The specific grid is exported, it is supposed to be #{expected}, instead we have #{actual}.')
			.expect(postData.keys).toEqual(['K36']);
        await libraryPage.reload();

    });

    // [TC61650] Export to Excel - Empty grid cannot export as Excel
    // 1. Go to "No grid" page by TOC
    // 2. Click share icon to open share panel
    // 3. Check if Export Grid to Excel button disable

    it('[TC61650] Export to Excel - Empty grid can export as Excel', async() => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName:'Number of grid',pageName:'No grid'});
        await dossierPage.openShareDropDown();
        since('The page contains empty grid, the export to excel icon disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await takeScreenshotByElement(share.getSharePanel(),'TC61650_m2021', 'No grid', {tolerance: 0.3});
    });


    // [TC61651] Export to Excel - One grid page should export directly
    // 1. Go to "One grid" page by TOC
    // 2. Click share icon to open share panel
    // 3. Check if Export Grid to Excel button enable
    // 4. Click export button and check if the excel file download successfully

    it('[TC61651] Export to Excel - One grid page should export directly', async() => {
        await deleteFile({name:'(AUTO) Export to Excel_One grid',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName:'Number of grid',pageName:'One grid'});
        await dossierPage.sleep(1000);
        await dossierPage.openShareDropDown();
        since('The page contains one grid, the export to excel icon disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await takeScreenshotByElement(share.getSharePanel(),'TC61651_m2021', 'One grid', {tolerance: 0.3});
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await excelExportPanel.clickExportButton();
        await dossierPage.sleep(1000);
       // await share.waitForDownloadComplete(ExcelOneGrid);
        //since(`The excel file for ${dossier.name} was not downloaded`)
            //.expect(await isFileNotEmpty(ExcelOneGrid)).toBe(true);

        await share.waitForDownloadComplete({name:'(AUTO) Export to Excel_One grid',fileType:'.xlsx'});
        since(`The excel file for ${dossier.name} was not downloaded`)
                .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_One grid',fileType:'.xlsx'})).toBe(true);
    });

    // [TC61652] Export to Excel - Check Compound grid can be export to excel
    // 1. Click share icon to open share panel
    // 2. Check if Export Grid to Excel button enable
    // 3. Click export button and check if the grid panel shows
    // 4. Hover on the "Compound grid" and check if the corresponding grid shadow out
    // 6. Select the "Compound grid" and check if the corresponding grid highlight and if Export button enable
    // 7. Click export button and check if the excel file download successfully

    it('[TC61652] Export to Excel - Check Compound grid can be export to excel', async() => {
        await deleteFile({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openMenu();
        await toc.goToPage({chapterName:'Chapter 1',pageName:'Overview'});
        await dossierPage.openShareDropDown();
        since('The page contains more than one grids, the export to excel icon disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await excelExportPanel.hoverOnGrid('Compound Grid');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61652_m2021', 'Hover on Compound Grid', {tolerance: 0.3});
        await excelExportPanel.selectGridOnly('Compound Grid');
        since('The grid is empty, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61652_m2021', 'Select Compound Grid', {tolerance: 0.3});
        await excelExportPanel.clickExportButton();
        await share.waitForDownloadComplete({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'});
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'})).toBe(true);
    });

    // [TC61654] Export to Excel - Check long grid name can display well in Grid list
    // 1. Go to "Multiple grid" by TOC
    // 2. Click share icon to open share panel
    // 3. Hover on the long name grid

    it('[TC61654] Export to Excel - Check long grid name can display well in Grid list', async() => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        const GridName = 'LongName 1234567890123456789012345678901234567890';
        await dossierPage.sleep(3000);
        await toc.openPageFromTocMenu({chapterName:'Number of grid',pageName:'Multiple grid'});
        await dossierPage.openShareDropDown();
        since('The page contains more than one grids, the export to excel icon disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await share.isExportExcelDisable()).toBe(false);
        await share.clickExportToExcel();
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await excelExportPanel.hoverOnGrid(GridName);
        await dossierPage.sleep(1000);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61654_m2021', 'Hover on long name Grid', {tolerance: 0.3});
    });

    //Entry point: from vis

    // [TC61656] Export tso Excel - Check grid can be export to excel from visualization
    // 1. Go to "Multiple grid" by TOC
    // 2. Hover on the visualization
    // 3. Click menu > Export > Excel and check if the excel file download successfully

    it('[TC61656] Export to Excel - Check grid can be export to excel from visualization', async() => {
        await deleteFile({name:'(AUTO) Export to Excel',fileType:'.xlsx'});
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await toc.openPageFromTocMenu({chapterName:'Number of grid',pageName:'Multiple grid'});
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Swap');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name:'(AUTO) Export to Excel',fileType:'.xlsx', visName: 'Swap'});
        await dossierPage.sleep(1000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Hide Row Header');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'Hide Row Header'});
        await dossierPage.sleep(1000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Hide Column Header');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'Hide Column Header'});
        await dossierPage.sleep(1000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Only Metric & Hide Column Header');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'Only Metric & Hide Column Header'});
        await dossierPage.sleep(1000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);
        await baseVisualization.selectExportToExcelOnVisualizationMenu('Only Metric & Hide Row Header');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'Only Metric & Hide Row Header'});
        await dossierPage.sleep(1000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);

        //TODO：The scenario will failed due to DE161824

        // await baseVisualization.selectExportToExcelOnVisualizationMenu('Only Attribute & Hide Row Header');
        // await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'Only Attribute & Hide Row Header'});
        // since(`The excel file for ${dossier.name} was not downloaded`)
        //     .expect(await isFileNotEmpty(dossierFile)).toBe(true);

        await baseVisualization.selectExportToExcelOnVisualizationMenu('No Data Return');
        since('Exporting panel displayed is supposed to be #{expected}, instead we have #{actual}')
            .expect(await excelExportPanel.isVizualizationExportExcelDialogwOpen()).toBe(true);
        await excelExportPanel.clickVisualizationExportButton();
        //await baseVisualization.waitForDownloadComplete({name: dossierFile.name, fileType:dossierFile.fileType, visName: 'No Data Return'});
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel',fileType:'.xlsx'})).toBe(true);
    });

    //small screen device
    // [TC61657] Export to Excel - Verify the responsiveness of export grid to excel
    // 1. Modify the browser window size to <600 px
    // 2. Click Hamburger icon in dossier
    // 3. Click Share
    // 4. Click Export Grid to Excel
    // 5. Select empty grid and check if Export button enable
    // 6. Select "Normal grid" and check if Export button enable
    // 7. Click export button and check if the excel file download successfully

    it('[TC61657] Export to Excel - Verify the responsiveness of export grid to excel', async() => {
        await libraryPage.moveDossierIntoViewPort(dossier.name);
        await libraryPage.openDossier(dossier.name);
        await dossierPage.sleep(1000);
        await toc.openMenu();
        await dossierPage.sleep(1000);
        await toc.goToPage({chapterName:'Chapter 1',pageName:'Overview'});
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 599,
            height: 1000
        });

        await dossierPage.clickHamburgerMenu();
        await hamburgerMenu.clickShare();
        await hamburgerMenu.sleep(1000);
        await hamburgerMenu.clickExportToExcel();
        await dossierPage.sleep(1000);
        await excelExportPanel.selectExcelContents('Each visualization separately');
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61657_m2021', 'Grid list', {tolerance: 0.3});
        await excelExportPanel.selectGridOnly('Empty Grid');
        since('The grid is empty, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await excelExportPanel.selectGrid('Enable Banding');
        since('The grid is not empty, the export button disabled is supposed to be #{expected}, instead we have #{actual}.')
            .expect(await excelExportPanel.isExportDisabled()).toBe(false);
        await takeScreenshotByElement(excelExportPanel.getExportExcelPanel(),'TC61657_m2021', 'Select Enable Banding', {tolerance: 0.3});
        await excelExportPanel.clickExportButton();
        await libraryPage.sleep(3000);
        since(`The excel file for ${dossier.name} was not downloaded`)
            .expect(await isFileNotEmpty({name:'(AUTO) Export to Excel_Overview',fileType:'.xlsx'})).toBe(true);

        await dossierPage.sleep(1000);
        await setWindowSize({
            browserInstance: browsers.browser1,
            width: 800,
            height: 1000
        });
    });


});
