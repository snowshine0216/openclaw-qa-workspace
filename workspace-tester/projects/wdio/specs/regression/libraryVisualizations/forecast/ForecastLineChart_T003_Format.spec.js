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
            id: 'DE17F47D544576C4F8C34F9AEDF7F8DC',
            name: 'ForcastLineChart_T003_Format',
        },
        testName: 'ForcastLineChart_T003_Format',
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
        if (!styleOnly) {
            await forecastTrend.clickColorPickDropDown(abaloc2);
            await forecastTrend.chooseColorInColorPicker(abaloc2);
            await forecastTrend.dismissPopups();
            await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `00_LineFontColor${round}`, {tolerance: 3});
            await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `01_LineFontColor${round}`, {tolerance: 3});
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
        await forecastTrend.clickFontSizeInc();

        await forecastTrend.clickFontSizeDec();

        await forecastTrend.clickColorPickDropDown(abaloc);
        await forecastTrend.chooseColorInColorPicker(abaloc);
        await forecastTrend.dismissPopups();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `02_EntireFontColor${round}`, {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `03_EntireFontColor${round}`, {tolerance: 3});
    }

    async function testOnSeries(suffix) {
        //Forcast Lines
        await testLineFormatting('abaloc-select-forecastlinetype', undefined, `${suffix}-1`, true);
        //Confidence Bands
        await forecastTrend.clickDropDown('abaloc-select-confidencebandstyle');
        await forecastTrend.clickDropDownItem('Fill');

        // //Fill opacity
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `00_forecast_${suffix}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `01_forecast_${suffix}`);

        await forecastTrend.clickDropDown('abaloc-select-confidencebandstyle');
        await forecastTrend.clickDropDownItem('Line');
        await testLineFormatting('abaloc-horizontallayout-confidencebandline', 2, `${suffix}-2`, true);

        await forecastTrend.clickDropDown('abaloc-select-confidencebandstyle');
        await forecastTrend.clickDropDownItem('None');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `04_ConfidenceBands_${suffix}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `05_ConfidenceBands_${suffix}`);

        //Dividing Line
        await testLineFormatting(
            'abaloc-select-dividinglinetype',
            'abaloc-colorpicker-dividinglinecolor',
            `${suffix}-3`
        );
        await forecastTrend.clickSwitch('abaloc-switch-dividinglineswitch');
        //Data Labels
        await forecastTrend.clickSwitch('abaloc-switch-forecastdatalabelsenabled');
        await testFontFormatting('abaloc-colorpicker-forecastdatalabelfontcolor', `${suffix}-1`);

        //Show marker
        await forecastTrend.clickSwitch('abaloc-switch-markerforecastshow');
        await forecastTrend.clickColorPickDropDown('abaloc-colorpicker-markerforecastcolor');
        await forecastTrend.chooseColorInColorPicker('abaloc-colorpicker-markerforecastcolor');
        await forecastTrend.dismissPopups();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `00_MarkerFontColor_${suffix}`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `01_MarkerFontColor_${suffix}`);
    }

    async function testReferenceLine(type, inputValue) {
        await forecastTrend.clickReferenceLineAdd();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98435`, `00_ReferenceLineAdd`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98435`, `01_ReferenceLineAdd`);

        await forecastTrend.clickReferenceLineEnable();
        await forecastTrend.clickReferenceLineEnable();

        await forecastTrend.clickDropDown(`referencelineoption`);
        await forecastTrend.clickDropDownItem(type);

        if (inputValue) {
            await forecastTrend.setReferenceLineConstantValue(inputValue);
            await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98435`, `01_ReferenceLine${type}Value`);
        }

        await forecastTrend.clickLineLabelSwitch();
        await forecastTrend.clickLineLabelSwitch();

        await forecastTrend.clickBarLogicMetric();
        await forecastTrend.clickBarLogicValue();
        await forecastTrend.clickBarLogicType();

        await forecastTrend.clickBarLogicMetric();
        await forecastTrend.clickBarLogicValue();
        await forecastTrend.clickBarLogicType();
        await visualizationPanel.takeScreenshotBySelectedViz(`TC98435`, `02_ReferenceLine${type}_BarLogicType`);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel(`TC98435`, `03_ReferenceLine${type}_BarLogicType`);
        await forecastTrend.clickReferenceLineDelete();
    }

    it('[TC98435_01] ForcastLineChart Check Format panel in dashboard library 1.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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

        //Horizontal Axis
        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Auto');

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Horizontal');

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Vertical');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', '00_Horizontal_RotationVertical', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', '01_Horizontal_RotationVertical', {tolerance: 3});

        await forecastTrend.clickRotationDropDown();
        await forecastTrend.clickRotationOption('Custom');
        await forecastTrend.clickRotationCustomOption('45°');
        //diable
        await forecastTrend.clickAxisTitle();

        //Vertical axis
        await forecastTrend.clickAxisDirection();
        await forecastTrend.clickVerticalAxisOption();

        //diable
        await forecastTrend.clickAxisTitle();
        await forecastTrend.clickAxisLabel();
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', '00_Vertical_HideAxisLabel_T01', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', '01_Vertical_HideAxisLabel_T01', {tolerance: 3});
    });

    it('[TC98435_02] ForcastLineChart Check Format panel in dashboard library 2.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', '00_DataLabelsHideOL', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', '01_DataLabelsHideOL', {tolerance: 3});
    });

    it('[TC98435_03] ForcastLineChart Check Format panel in dashboard library 3.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToVizOptionTab();
        await forecastTrend.dismissTooltip();
        //Reference line
        //Max
        await testReferenceLine('Maximum');
        await testReferenceLine('Constant', 5000);
    });

    it('[TC98435_04] ForcastLineChart Format panel text and forms 1.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Entire graph
        await forecastTrend.clickTextAndFormDropDown();

        await forecastTrend.clickEntireGraph();

        await testFontFormatting('abaloc-colorpicker-fontcolorglobal', 2);
    });

    it('[TC98435_05] ForcastLineChart Format panel text and forms 2.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', `00_MarkerFontColorOption2`, {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', `01_MarkerFontColorOption2`, {tolerance: 3});

        await testLineFormatting('abaloc-select-mainlinetype', 'abaloc-colorpicker-mainlinecolor', 4);
    });

    it('[TC98435_06] ForcastLineChart Format panel text and forms 3.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Axis and grid lines
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickAxisAndGridLines();

        //Axis Format

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

        // Lines
        await testLineFormatting('abaloc-select-allaxeslinestyle', 'abaloc-colorpicker-allaxeslinecolor', 5);
    });

    it('[TC98435_07] ForcastLineChart Format panel text and forms 3.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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

        // Font.
        // Axis Label
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Label');

        //Show labels
        await testFontFormatting('abaloc-colorpicker-xaxislabelfontcolor', 7);
        await forecastTrend.clickSwitch('abaloc-switch-xaxislabelshow');
        await visualizationPanel.takeScreenshotBySelectedViz('TC98435', '02_HideLabels', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98435', '03_HideLabels', {tolerance: 3});

        // Lines
        await testLineFormatting('abaloc-select-xaxislinestyle', 'abaloc-colorpicker-xaxislinecolor', 6);
    });

    it('[TC98435_08] ForcastLineChart Format panel text and forms 3.3', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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

        // Font.
        // Axis Label
        await forecastTrend.clickInlineDropDown('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel');
        await forecastTrend.clickInlineDropDownItem('abaloc-segmentcontroldropdownmenu-gmaxistitlelabel', 'Axis Label');

        //Show labels
        await testFontFormatting('abaloc-colorpicker-yaxislabelfontcolor', 9);
        // Lines
        await testLineFormatting('abaloc-select-yaxislinestyle', 'abaloc-colorpicker-yaxislinecolor', 7);
    });

    it('[TC98435_09] ForcastLineChart Format panel text and forms 3.4', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

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

    it('[TC98435_10] ForcastLineChart Format panel text and forms 4.1', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Forecast
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickForecast();

        await forecastTrend.clickDropDown('abaloc-select-breakbyforecastformattingselector');
        await forecastTrend.clickDropDownItem('All');

        await testOnSeries('All');
    });

    it('[TC98435_11] ForcastLineChart Format panel text and forms 4.2', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Format',
        });
        await aiAssistant.selectViz('Forecast1');

        await formatPanel.switchToFormatPanel();
        await formatPanel.switchToTextAndFormTab();
        await forecastTrend.dismissTooltip();

        //Forecast
        await forecastTrend.clickTextAndFormDropDown();
        await forecastTrend.clickForecast();

        await forecastTrend.clickDropDown('abaloc-select-breakbyforecastformattingselector');
        await forecastTrend.clickDropDownItem('Annapolis');
        await testOnSeries('Annapolis');
    });
});
