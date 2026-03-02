import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { dataset } from '../../../../constants/bot.js';

describe('Test for trend line chart', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial',
        },
        trendLine: {
            id: 'A67A0B2C0D475F0FD7F8AA98D35D48AD',
            name: 'TrendLineChart_T004_XFunction',
        },
        testName: 'TrendLineChart_T004_XFunction',
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
        datasetsPanel,
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

    it('[TC98441_01] TrendLineChart XFunctions 1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        let vizMenu = await forecastTrend.clickAndgetVizMenu('Trend1');

        //Show data
        await forecastTrend.clickVizMenuItemByName('Show Data');

        let showData = forecastTrend.getShowDataDialog();
        await forecastTrend.closeShowDataDialog();

        //Duplicate
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Duplicate');

        let allVizPanel = await visualizationPanel.getDisplayedPage();

        await forecastTrend.checkElementByImageComparison(allVizPanel, 'TC98441', '01_Duplicate');
    });

    it('[TC98441_02] TrendLineChart XFunctions 2.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Copy to New page
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Copy to');

        await forecastTrend.clickVizMenuSubItemByName('New Page');

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_CopytoNewPage', {tolerance: 3});
    });

    xit('[TC98441_03] TrendLineChart XFunctions 2.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Copy to New chapter
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Copy to');

        await forecastTrend.clickVizMenuSubItemByName('New Chapter');

        await forecastTrend.clickAlertYes();

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_CopytoNewChapter', {tolerance: 3});
    });

    xit('[TC98441_04] TrendLineChart XFunctions 2.3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Move to New page
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Move to');

        await forecastTrend.clickVizMenuSubItemByName('New Page');

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_MovetoNewPage', {tolerance: 3});
    });

    xit('[TC98441_05] TrendLineChart XFunctions 2.4', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Move to New chapter
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Move to');

        await forecastTrend.clickVizMenuSubItemByName('New Chapter');

        await forecastTrend.clickAlertYes();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '00_MovetoNewChapter', {tolerance: 3});

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_MovetoNewChapter', {tolerance: 3});
    });

    it('[TC98441_06] TrendLineChart XFunctions 3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Format
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Format');

        //Copy formatting
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Copy Formatting');

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page2',
        });
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);

        //Paste formatting
        await aiAssistant.selectViz('Trend2');
        await dossierPage.sleep(1000);

        await forecastTrend.clickAndgetVizMenu('Trend2');
        await forecastTrend.clickVizMenuItemByName('Paste Formatting');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '00_CopyPasteFormat', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98441', '01_CopyPasteFormat', {tolerance: 3});
    });

    it('[TC98441_07] TrendLineChart XFunctions 4.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Rename
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Rename');
        await browser.keys('abc');
        await browser.keys('Enter');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_Rename', {tolerance: 3});
    });

    it('[TC98441_08] TrendLineChart XFunctions 4.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Page1',
        });
        await aiAssistant.selectViz('Trend1');
        await dossierPage.sleep(1000);

        //Delete
        await forecastTrend.clickAndgetVizMenu('Trend1');
        await forecastTrend.clickVizMenuItemByName('Delete');

        await visualizationPanel.takeScreenshotBySelectedViz('TC98441', '01_Delete', {tolerance: 3});
    });
});
