import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { Key } from 'webdriverio';
import InCanvasSelector from '../../../../pageObjects/selector/InCanvasSelector.js';
import { dossier } from '../../../../constants/teams.js';

describe('AutoNarratives_i18n', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: '41BFE1CC484C8A17D6754093CB4FC23D',
            name: 'NLG_i18N',
        },
        testName: 'AutoNarratives_i18n',
    };

    let {
        loginPage,
        libraryPage,
        baseVisualization,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        dossierAuthoringPage,
        formatPanel,
        autoNarratives,
        editorPanel,
        visualizationPanel,
        toc,
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

    it('[TC97167_1] i18N [Library Web] Check i18n string in dashboard library.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });

        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'AddNLG',
        });
        await vizGallery.clickOnInsertVI('可视化效果');
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Auto 叙述');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_1', '00_EditorPanel');
        //check auto refresh
        await autoNarratives.hoverOnAutoRefreshInfo();
        await since('Auto refresh tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getTextFromDisplayedTooltip())
            .toContain('选中Auto Refresh，自动更新使用中的摘要内容。');
        await autoNarratives.checkEmptySummary('TC97167_1', '01_AddNLG');
        await autoNarratives.hoverOnInstructionIcon();
        await since('AINstruction tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getTextFromDisplayedTooltip())
            .toContain(
                '使用 @ 指定某个特定的可视化效果，让 "Auto 叙述" 为您总结， 您也可选择总结整个页面。此外，你还可以指定叙述的输出格式，例如项目符号、段落和颜色突出显示（例如，绿色表示积极趋势，红色表示消极趋势）。'
            );
        // await autoNarratives.checkInstructionTooltip('TC97167_1', '02_Check_Instruction_Tooltip');
        await dossierAuthoringPage.clickTopLeftCorner();
        await autoNarratives.clickEmptySummary(0);
        await autoNarratives.setInstructionOnly('总结 @');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_1', '02_ListVisualizations_Editor');
        await visualizationPanel.takeScreenshotBySelectedViz('TC97167_1', '03_ListVisualizations_Viz');
        await autoNarratives.setInstructionOnly(['总结 @', Key.ArrowDown]);
        await visualizationPanel.takeScreenshotBySelectedViz('TC97167_1', '04_Highlight_Grid');
        //Try to save dashboard without click [Generate]
        await autoNarratives.setInstructionOnly([
            '总结 @',
            Key.Tab,
            '用红色显示排列前10航线名称以及各个航线的延误时间,降序排列.句子格式参考下方的例句： Delta Air Lines Inc. 延误时间为',
        ]);
        await autoNarratives.clickGenerate();
        await since('NLG summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex(''))
            .toContain('延误');
        await formatPanel.switchToFormatPanel();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_1', 'FormatPanel');
        await autoNarratives.switchAlignment('middle');
        await autoNarratives.switchWorkflow('剪辑');
        await autoNarratives.switchCellPadding('large');
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'wrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_1', 'ChangedFormatPanel');
        await dossierEditorUtility.checkVIDoclayout('TC97167_1', 'ChangedFormatPanel_Image');
        await editorPanel.switchToEditorPanel();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_1', 'EditorPanel');
    });

    it('[TC97167_2] i18N [Library Web] Check refresh.', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageWithNLG({
            chapterName: 'Chapter 1',
            pageName: 'Refresh',
        });

        await autoNarratives.checkDisclaimRefreshDisplay('TC97167_2', '01_DisplayRefreshIcon');
        await since('Page refresh summary text should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Comair Inc.');

        //Change selection in ICS filter
        const selector = InCanvasSelector.createByAriaLable('Airline Name');
        // select item
        await selector.selectItem('Comair Inc.');
        await autoNarratives.checkDisclaimRefreshDisplay('TC97167_2', '02_DisplayRefreshWithDataChanged');
        await autoNarratives.clickRefreshIcon();
        await since('Page 1 summary text title should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Expressjet Airlines Inc.');
        await autoNarratives.checkDisclaimRefreshDisplay('TC97167_2', '14_DisplayRefreshIcon');
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC97167_2', 'AfterRefresh');
        await baseVisualization.openMenuOnVisualization('SourceGrid');
        await baseVisualization.checkVizContainerMenu('TC97167_2', '15_VizContainerMenu');
    });
    it('[TC97167_3] ACC [Library Web] Data cut message', async () => {
        // Open dashboard in consumption mode
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'DataCut' });
        await autoNarratives.checkDisclaimRefreshDisplay('TC97167_1_3', '00_DisplayRefreshIcon');
        await autoNarratives.hoverOnDataCutInfoIcon();
        await since('Data cut tooltip should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getDataCutInfoTooltipText())
            .toContain('由于数据量较大，叙述内容仅根据子集数据生成，可能无法完全反映整个数据集。');
    });
});
