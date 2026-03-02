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
            id: '73545B04214EC3837DC82F984F788B5C',
            name: 'TrendLineChart_T003_Format',
        },
        testName: 'TrendLineChart_T003_Format',
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

    async function testLineFormatting(abaloc1, abaloc2, round, styleOnly) {
        await forecastTrend.clickTypeDropDown(abaloc1);
        await forecastTrend.chooseTypeInDropDown('dash-thick');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `00_LineTypeDashThick${round}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `01_LineTypeDashThick${round}`);

        if (!styleOnly) {
            await forecastTrend.clickColorPickDropDown(abaloc2);
            await forecastTrend.chooseColorInColorPicker(abaloc2);
            await forecastTrend.dismissPopups();
            await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `00_LineFontColor${round}`);
            await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `01_LineFontColor${round}`);
        }
    }

    async function testFontFormatting(abaloc, round) {
        await formatPanel.selectFontType('Oleo Script');

        //FontBold
        await forecastTrend.clickFontStyle(1);
        //FontItalic
        await forecastTrend.clickFontStyle(2);
        //FontUnderline
        await forecastTrend.clickFontStyle(3);
        //FontStrike
        await forecastTrend.clickFontStyle(4);
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `02_FontStrike${round}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `03_FontStrike${round}`);

        await forecastTrend.clickFontSizeInc();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `02_FontSizeInc${round}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `03_FontSizeInc${round}`);

        await forecastTrend.clickFontSizeDec();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `02_FontSizeDec${round}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `03_FontSizeDec${round}`);

        await forecastTrend.clickColorPickDropDown(abaloc);
        await forecastTrend.chooseColorInColorPicker(abaloc);
        await forecastTrend.dismissPopups();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `02_EntireFontColor${round}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `03_EntireFontColor${round}`);
    }

    async function testReferenceLine(type, inputValue) {
        await forecastTrend.clickReferenceLineAdd();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLineAdd`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLineAdd`);

        await forecastTrend.clickReferenceLineEnable();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLineEnable`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLineEnable`);
        await forecastTrend.clickReferenceLineEnable();

        await forecastTrend.clickDropDown(`referencelineoption`);
        await forecastTrend.clickDropDownItem(type);
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLine${type}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLine${type}`);

        if (inputValue) {
            await forecastTrend.setReferenceLineConstantValue(inputValue);
            await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLine${type}Value`);
            await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLine${type}Value`);
        }

        await forecastTrend.clickLineLabelSwitch();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLine${type}_LineLabelSwitch`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLine${type}_LineLabelSwitch`);
        await forecastTrend.clickLineLabelSwitch();

        await forecastTrend.clickBarLogicMetric();
        await forecastTrend.clickBarLogicValue();
        await forecastTrend.clickBarLogicType();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98440`, `00_ReferenceLine${type}_BarLogicType`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98440`, `01_ReferenceLine${type}_BarLogicType`);
        await forecastTrend.clickReferenceLineDelete();
    }

    it('[TC98440_01] TrendLineChart Check Format panel in dashboard library 1.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();

        await forecastTrend.clickContainerFitSection();

        await forecastTrend.clickContainerFitDropDown();
        await forecastTrend.clickContainerFitOption('none');

        await forecastTrend.clickContainerFitDropDown();
        await forecastTrend.clickContainerFitOption('compact');

        // Data Labels.
        await forecastTrend.clickDataLabelSwitch();

        await forecastTrend.clickDataLabelHideOverlappingLabels();

        await forecastTrend.clickDataLabelHideOverlappingLabels();

        // Axes
        await forecastTrend.clickAxesSection();

        await forecastTrend.clickGridLines();

        //Show grid line.
        await forecastTrend.clickGridLines();

        await forecastTrend.clickGridLineOption('auto');

        await forecastTrend.clickGridLineOption('full');

        await forecastTrend.clickGridLineOption('dotted');

        //Horizontal axis
        await forecastTrend.clickAxisDirection();
        await forecastTrend.clickHorizontalAxisOption();

        //diable
        await forecastTrend.clickAxisTitle();

        //enable
        await forecastTrend.clickAxisTitle();

        await forecastTrend.clickAxisLabel();

        //enable
        await forecastTrend.clickAxisLabel();
        await dossierPage.sleep(1000);

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Auto');

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Horizontal');

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Vertical');

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Custom');
        await forecastTrend.clickRotationCustomOption('60°');

        //Vertical axis
        await forecastTrend.clickAxisDirection();
        await forecastTrend.clickVerticalAxisOption();

        //diable
        await forecastTrend.clickAxisTitle();

        //enable
        await forecastTrend.clickAxisTitle();

        await forecastTrend.clickAxisLabel();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', '00_Vertical_AxisLabel', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', '01_Vertical_AxisLabel', {tolerance: 3});

        //enable
        await forecastTrend.clickAxisLabel();
    });

    it('[TC98440_02] TrendLineChart Check Format panel in dashboard library 2.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();

        //Legend
        await forecastTrend.clickLegendSwitch();

        await forecastTrend.clickShowTitle();

        await forecastTrend.clickShowTitle();

        //TrendLine
        await forecastTrend.clickTrendLineSwitch();

        //Forecast
        await forecastTrend.clickForecastSwitch();

        await forecastTrend.clickForecastLengthUp();

        await forecastTrend.clickForecastLengthDown();

        await forecastTrend.clickDataLabelsSwitch();

        await forecastTrend.clickDataLabelsHideOL();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', '00_DataLabelsHideOL', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', '01_DataLabelsHideOL', {tolerance: 3});
    });

    it('[TC98440_03] TrendLineChart Check Format panel in dashboard library 3.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();
        //Reference line
        //Max
        await testReferenceLine('Maximum');
        await testReferenceLine('Constant', 5000);
    });

    it('[TC98440_04] TrendLineChart Format panel text and forms 1.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Entire graph
        await forecastTrend.clickTextAndFormDropDown();

        await forecastTrend.clickEntireGraph();

        await testFontFormatting('abaloc-colorpicker-fontcolorglobal', 2);
    });

    it('[TC98440_05] TrendLineChart Format panel text and forms 2.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //DataLabel And Shapes
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickDataLabelAndShapes();

        await forecastTrend.clickShowDataLabels();

        await testFontFormatting('abaloc-colorpicker-datalabelfontcolor', {tolerance: 3});

        //Show marker
        await forecastTrend.clickShowMaker();

        await forecastTrend.clickColorPickDropDown('abaloc-colorpicker-markercolor');
        await forecastTrend.chooseColorInColorPicker('abaloc-colorpicker-markercolor');
        await forecastTrend.dismissPopups();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', `00_MarkerFontColorOption2`, {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', `01_MarkerFontColorOption2`, {tolerance: 3});

        await testLineFormatting('abaloc-select-mainlinetype', 'abaloc-colorpicker-mainlinecolor', 4);
    });

    it('[TC98440_06] TrendLineChart Format panel text and forms 3.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Axis and grid lines
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickAxisAndGridLines();

        //Axis Format
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-axisformatoptions');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-axisformatoptions', 'Both Axes');

        //Font.
        // Axis Title
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Title');

        //Show title
        await testFontFormatting('abaloc-colorpicker-allaxestitlefontcolor', 4);
        await forecastTrend.clickSwitch('abaloc-switch-allaxestitleshow');

        // Font.
        // Axis Label
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Label');

        //Show labels
        await testFontFormatting('abaloc-colorpicker-allaxeslabelfontcolor', 5);
        await forecastTrend.clickSwitch('abaloc-switch-allaxeslabelshow');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', '00_HideLabels_T06', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', '01_HideLabels_T06', {tolerance: 3});

        // Lines
        await testLineFormatting('abaloc-select-allaxeslinestyle', 'abaloc-colorpicker-allaxeslinecolor', 5);
    });

    it('[TC98440_07] TrendLineChart Format panel text and forms 3.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Axis and grid lines
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickAxisAndGridLines();

        //Axis Format
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-axisformatoptions');
        await forecastTrend.clickInlineDropDownItem(
            'abaloc-segmentcontroldropdownmenu-axisformatoptions',
            'Horizontal Axis'
        );

        //Font.
        // Axis Title
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Title');

        //Show title
        await testFontFormatting('abaloc-colorpicker-xaxistitlefontcolor', 6);
        await forecastTrend.clickSwitch('abaloc-switch-xaxistitleshow');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', '02_HideTitle', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', '03_HideTitle', {tolerance: 3});

        // Font.
        // Axis Label
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Label');

        //Show labels
        await testFontFormatting('abaloc-colorpicker-xaxislabelfontcolor', 7);

        // Lines
        await testLineFormatting('abaloc-select-xaxislinestyle', 'abaloc-colorpicker-xaxislinecolor', 6);
    });

    it('[TC98440_08] TrendLineChart Format panel text and forms 3.3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Axis and grid lines
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickAxisAndGridLines();

        //Axis Format
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-axisformatoptions');
        await forecastTrend.clickInlineDropDownItem(
            'abaloc-segmentcontroldropdownmenu-axisformatoptions',
            'Vertical Axis'
        );

        //Font.
        // Axis Title
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Title');

        //Show title
        await testFontFormatting('abaloc-colorpicker-yaxistitlefontcolor', 8);
        await forecastTrend.clickSwitch('abaloc-switch-yaxistitleshow');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98440', '02_ShowTitle', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98440', '03_ShowTitle', {tolerance: 3});
        // Font.
        // Axis Label
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Label');

        //Show labels
        await testFontFormatting('abaloc-colorpicker-yaxislabelfontcolor', 9);

        // Lines
        await testLineFormatting('abaloc-select-yaxislinestyle', 'abaloc-colorpicker-yaxislinecolor', 7);
    });

    it('[TC98440_09] TrendLineChart Format panel text and forms 3.4', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Axis and grid lines
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickAxisAndGridLines();

        //Axis Format
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-axisformatoptions');
        await forecastTrend.clickInlineDropDownItem(
            'abaloc-segmentcontroldropdownmenu-axisformatoptions',
            'Grid Lines'
        );

        // Lines
        await testLineFormatting('abaloc-select-allgridlinestyle', 'abaloc-colorpicker-allgridlinecolor', 8);
    });

    it('[TC98440_10] TrendLineChart Format panel text and forms 4.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Forecast
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickTrendLine();

        await forecastTrend.clickDropDown('abaloc-select-breakbytrendformattingselector');
        await forecastTrend.clickDropDownItem('All');

        await testLineFormatting('abaloc-select-trendlinestyleselector', undefined, `All-1`, true);
    });

    it('[TC98440_11] TrendLineChart Format panel text and forms 4.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Trend1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Forecast
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickTrendLine();

        await forecastTrend.clickDropDown('abaloc-select-breakbytrendformattingselector');
        await forecastTrend.clickDropDownItem('Annapolis');

        await testLineFormatting('abaloc-select-trendlinestyleselector', undefined, `Annapolis-1`, true);
    });
});
