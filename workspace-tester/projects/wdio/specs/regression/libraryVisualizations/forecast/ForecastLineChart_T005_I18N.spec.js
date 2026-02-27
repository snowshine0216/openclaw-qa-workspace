import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('Test for forecast line chart', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        trendLine: {
            id: 'FD5422DA4645C9DD06D51FBEDCF3A71C',
            name: 'ForcastLineChart_T005_I18n',
        },
        testName: 'ForcastLineChart_i18n',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        baseVisualization,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        formatPanel,
        editorPanel,
        visualizationPanel,
        aiAssistant,
        forecastTrend,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizUser_chn.credentials);
        await loginPage.disableTutorial();
        await loginPage.enableABAlocator();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98437_01] ForcastLineChart Check i18n in dashboard library 1.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'I18n',
        });
        await vizGallery.clickOnInsertVI('可视化效果');
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('预测折线图');

        // viz menu
        let vizMenu = await forecastTrend.clickAndgetVizMenu('Forecast1');

        //data source
        await forecastTrend.clickVizMenuItemByName('数据源');
        let subMenu = await baseVisualization.getContextMenuByLevel(1);
        await dossierPage.waitForElementVisible(subMenu, { timeout: dossierPage.DEFAULT_TIMEOUT * 100 });

        await forecastTrend.clickVizMenuItemByName('导出');
        subMenu = await baseVisualization.getContextMenuByLevel(1);
        await dossierPage.waitForElementVisible(subMenu, { timeout: dossierPage.DEFAULT_TIMEOUT * 100 });

        await forecastTrend.clickVizMenuItemByName('复制到');
        subMenu = await baseVisualization.getContextMenuByLevel(1);
        await dossierPage.waitForElementVisible(subMenu, { timeout: dossierPage.DEFAULT_TIMEOUT * 100 });

        await forecastTrend.clickVizMenuItemByName('移至');
        subMenu = await baseVisualization.getContextMenuByLevel(1);
        await dossierPage.waitForElementVisible(subMenu, { timeout: dossierPage.DEFAULT_TIMEOUT * 100 });
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98437', '03_VizSubMenu');

        await forecastTrend.dismissPopups();
    });

    it('[TC98437_02] ForcastLineChart Check i18n in dashboard library 2.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'I18n',
        });

        await aiAssistant.selectViz('Forecast1');
        await editorPanel.switchToFormatPanel();
        await dossierPage.sleep(1000);

        // Target Metrics
        await forecastTrend.clickTargetNameDropZone();
        let contextMenu = await forecastTrend.getContextMenu();

        //sub menus "Aggregate By"
        await forecastTrend.clickMenuItemByName('聚合依据');
        let subMenu = await forecastTrend.getSubMenu();

        await forecastTrend.clickMenuItemByName('计算');
        let contextMenuEditor = await forecastTrend.getContextMenuEditor();

        //sub menus "Shortcut Metric"
        await forecastTrend.clickMenuItemByName('快捷方式度量');
        subMenu = await forecastTrend.getSubMenu();

        //sub menus "Number Format
        await forecastTrend.clickMenuItemByName('数字格式');
        contextMenuEditor = await forecastTrend.getContextMenuEditor();

        //sub menus "Replace With"
        await forecastTrend.clickMenuItemByName('替换内容');
        subMenu = await forecastTrend.getSubMenu();

        await forecastTrend.dismissPopups();

        //Time Attribute
        await forecastTrend.clickTimeAttributeDropZone();
        contextMenu = await forecastTrend.getContextMenu();

        //sub menus "Number Format"
        await forecastTrend.clickMenuItemByName('数字格式');
        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.checkElementByImageComparison(
            contextMenuEditor,
            'TC98437',
            '03_TimeAttributeDropZoneSubMenu'
        );

        await forecastTrend.dismissPopups();

        //Break By
        await forecastTrend.clickBreakByDropZone();
        contextMenu = await forecastTrend.getContextMenu();

        //sub menus "Number Format"
        await forecastTrend.clickMenuItemByName('数字格式');
        contextMenuEditor = await forecastTrend.getContextMenuEditor();

        await forecastTrend.dismissPopups();

        //sub menus "Replace With"
        await forecastTrend.clickBreakByDropZone();
        await forecastTrend.clickMenuItemByName('替换内容');
        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98437', '04_BreakByDropZoneSubMenu');
        await dossierPage.clickTopLeftCorner();
    });

    it('[TC98437_03] ForcastLineChart Check i18n in dashboard library 3.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'I18n',
        });
        await aiAssistant.selectViz('Forecast1');
        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();

        await forecastTrend.clickContainerFitSection();
        await forecastTrend.clickDataLabelSwitch();
        await forecastTrend.clickAxesSection();
        await forecastTrend.clickLegendSwitch();
        await forecastTrend.clickTrendLineSwitch();
        await forecastTrend.clickForecastSwitch();
        await forecastTrend.clickReferenceLineAdd();

        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();

        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        await formatPanel.switchToTitleAndContainerTab();
        await forecastTrend.dismissTooltip();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98437', '00_TitleAndContainerTab');
    });
});
