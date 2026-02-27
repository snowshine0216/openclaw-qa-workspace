import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('Test for trend line chart', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial',
        },
        trendLine: {
            id: '89B501D94943EAF3630ED58C025B0269',
            name: 'TrendLineChart_T002_Editor',
        },
        testName: 'TrendLineChart_T002_Editor',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        dossierEditorUtility,
        editorPanel,
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

    it('[TC98439] Trend Line Chart Check editor panel in dashboard library.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Editor',
        });
        await aiAssistant.selectViz('Trend 1');
        await editorPanel.switchToFormatPanel();
        await dossierPage.sleep(1000);
        await visualizationPanel.takeScreenshotBySelectedViz('TC98439', '00_EditorPanel');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98439', '01_EditorPanel');

        // Target Metrics
        await forecastTrend.clickTargetNameDropZone();
        let contextMenu = await forecastTrend.getContextMenu();
        await forecastTrend.checkElementByImageComparison(contextMenu, 'TC98439', '00_TargetNameDropZoneContextMenu');

        //sub menus "Aggregate By"
        await forecastTrend.clickMenuItemByName('Aggregate By');
        let subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98439', '00_TargetNameDropZoneSubMenu');

        // Test Sum
        await forecastTrend.clickSubMenuItemByName('Sum');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98439', '00_Sum');

        await forecastTrend.clickUndo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98439', '01_Sum');

        await forecastTrend.clickRedo();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98439', '02_Sum');

        //sub menus "Calculation"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Calculation');
        let contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.checkElementByImageComparison(contextMenuEditor, 'TC98439', '01_TargetNameDropZoneSubMenu');
        await forecastTrend.dismissPopups();

        //sub menus "Shortcut Metric"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Shortcut Metric');

        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98439', '02_TargetNameDropZoneSubMenu');
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');

        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.checkElementByImageComparison(contextMenuEditor, 'TC98439', '03_TargetNameDropZoneSubMenu');
        await forecastTrend.dismissPopups();

        //sub menus "Replace With"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Replace With');

        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98439', '04_TargetNameDropZoneSubMenu');
        await forecastTrend.dismissPopups();

        //Time Attribute
        await forecastTrend.clickTimeAttributeDropZone();
        contextMenu = await forecastTrend.getContextMenu();
        await forecastTrend.checkElementByImageComparison(
            contextMenu,
            'TC98439',
            '00_TimeAttributeDropZoneContextMenu'
        );
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickTimeAttributeDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');

        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.checkElementByImageComparison(
            contextMenuEditor,
            'TC98439',
            '03_TimeAttributeDropZoneSubMenu'
        );
        await forecastTrend.dismissPopups();

        //Break By
        await forecastTrend.clickBreakByDropZone();
        contextMenu = await forecastTrend.getContextMenu();
        await forecastTrend.checkElementByImageComparison(contextMenu, 'TC98439', '00_BreakByDropZoneContextMenu');
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickBreakByDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');
        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.checkElementByImageComparison(contextMenuEditor, 'TC98439', '03_BreakByDropZoneSubMenu');
        await forecastTrend.dismissPopups();

        //sub menus "Replace With"
        await forecastTrend.clickBreakByDropZone();
        await forecastTrend.clickMenuItemByName('Replace With');
        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98439', '04_BreakByDropZoneSubMenu');
        await forecastTrend.dismissPopups();
    });
});
