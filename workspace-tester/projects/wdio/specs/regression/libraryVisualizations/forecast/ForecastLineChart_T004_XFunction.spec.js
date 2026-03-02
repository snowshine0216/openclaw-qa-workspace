import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('Test for forecast line chart', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial',
        },
        trendLine: {
            id: '0A554ABC8C4634ACD3E3E4A608E993BE',
            name: 'ForcastLineChart_T004_XFunction',
        },
        testName: 'ForcastLineChart_T004_XFunction',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        dossierEditorUtility,
        visualizationPanel,
        formatPanel,
        aiAssistant,
        forecastTrend,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await loginPage.enableABAlocator();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98436_01] ForcastLineChart XFunctions 1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        let vizMenu = await forecastTrend.clickAndgetVizMenu('Forecast1');

        //Show data
        await forecastTrend.clickVizMenuItemByName('Show Data');

        let showData = forecastTrend.getShowDataDialog();
        await forecastTrend.closeShowDataDialog();

        //Duplicate
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Duplicate');

        let allVizPanel = await visualizationPanel.getDisplayedPage();

        // await libraryPage.scrollToTop();
        await forecastTrend.clickUndo();
        await forecastTrend.checkElementByImageComparison(allVizPanel, 'TC98436', '01_Duplicate');
    });

    xit('[TC98436_02] ForcastLineChart XFunctions 2.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Copy to New page
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Copy to');

        await forecastTrend.clickVizMenuSubItemByName('New Page');

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_CopytoNewPage', {tolerance: 3});
    });

    xit('[TC98436_03] ForcastLineChart XFunctions 2.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Copy to New chapter
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Copy to');

        await forecastTrend.clickVizMenuSubItemByName('New Chapter');

        await forecastTrend.clickAlertYes();

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_CopytoNewChapter', {tolerance: 3});
    });

    xit('[TC98436_04] ForcastLineChart XFunctions 2.3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Move to New page
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Move to');

        await forecastTrend.clickVizMenuSubItemByName('New Page');

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_MovetoNewPage', {tolerance: 3});
    });

    xit('[TC98436_05] ForcastLineChart XFunctions 2.4', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Move to New chapter
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Move to');

        await forecastTrend.clickVizMenuSubItemByName('New Chapter');

        await forecastTrend.clickAlertYes();

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_MovetoNewChapter', {tolerance: 3});
    });

    it('[TC98436_06] ForcastLineChart XFunctions 3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Format
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Format');

        //Copy formatting
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Copy Formatting');

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page2',
        });
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);

        //Paste formatting
        await aiAssistant.selectViz('Forecast2');
        await dossierPage.sleep(1000);

        await forecastTrend.clickAndgetVizMenu('Forecast2');
        await forecastTrend.clickVizMenuItemByName('Paste Formatting');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '00_CopyPasteFormat', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98436', '01_CopyPasteFormat', {tolerance: 3});
    });

    it('[TC98436_07] ForcastLineChart XFunctions 4.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Rename
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Rename');
        await browser.keys('abc');
        await browser.keys('Enter');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_Rename', {tolerance: 3});
    });

    it('[TC98436_08] ForcastLineChart XFunctions 4.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Forecast1');
        await dossierPage.sleep(1000);

        //Delete
        await forecastTrend.clickAndgetVizMenu('Forecast1');
        await forecastTrend.clickVizMenuItemByName('Delete');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '00_Delete', {tolerance: 3});

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98436', '01_Delete', {tolerance: 3});
    });
});
