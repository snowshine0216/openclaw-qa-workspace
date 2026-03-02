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
            id: '2BA53A66AE424AB92AB78D912A3E20F3',
            name: 'ForcastLineChart_T002_Editor',
        },
        testName: 'ForcastLineChart_T002_Editor',
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

    it('[TC98434] Forcast Line Chart Check editor panel in dashboard library.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Editor',
        });
        await aiAssistant.selectViz('Forecast1');
        await editorPanel.switchToFormatPanel();
        await dossierPage.sleep(1000);

        // Target Metrics
        await forecastTrend.clickTargetNameDropZone();
        let contextMenu = await forecastTrend.getContextMenu();

        //sub menus "Aggregate By"
        await forecastTrend.clickMenuItemByName('Aggregate By');
        let subMenu = await forecastTrend.getSubMenu();

        // Test Sum
        await forecastTrend.clickSubMenuItemByName('Sum');

        await forecastTrend.clickUndo();

        await forecastTrend.clickRedo();

        //sub menus "Calculation"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Calculation');
        let contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.dismissPopups();

        //sub menus "Shortcut Metric"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Shortcut Metric');

        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');

        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.dismissPopups();

        //sub menus "Replace With"
        await forecastTrend.clickTargetNameDropZone();
        await forecastTrend.clickMenuItemByName('Replace With');

        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.dismissPopups();

        //Time Attribute
        await forecastTrend.clickTimeAttributeDropZone();
        contextMenu = await forecastTrend.getContextMenu();
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickTimeAttributeDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');

        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.dismissPopups();

        //Break By
        await forecastTrend.clickBreakByDropZone();
        contextMenu = await forecastTrend.getContextMenu();
        await forecastTrend.dismissPopups();

        //sub menus "Number Format"
        await forecastTrend.clickBreakByDropZone();
        await forecastTrend.clickMenuItemByName('Number Format');
        contextMenuEditor = await forecastTrend.getContextMenuEditor();
        await forecastTrend.dismissPopups();

        //sub menus "Replace With"
        await forecastTrend.clickBreakByDropZone();
        await forecastTrend.clickMenuItemByName('Replace With');
        subMenu = await forecastTrend.getSubMenu();
        await forecastTrend.checkElementByImageComparison(subMenu, 'TC98434', '04_BreakByDropZoneSubMenu');
        await forecastTrend.dismissPopups();
    });
});
