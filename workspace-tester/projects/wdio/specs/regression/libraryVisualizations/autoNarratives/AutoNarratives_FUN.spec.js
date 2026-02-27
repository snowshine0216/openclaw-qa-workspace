import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import resetDossierState from '../../../../api/resetDossierState.js';
import * as consts from '../../../../constants/visualizations.js';
import { Key } from 'webdriverio';
import InCanvasSelector from '../../../../pageObjects/selector/InCanvasSelector.js';
import { dossier } from '../../../../constants/teams.js';

describe('AutoNarratives_FUN', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'E7DF0CCA460C5540CA4813A531D01743',
            name: 'NLG_Fun',
        },
        testName: 'AutoNarratives_FUN',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        dossierEditorUtility,
        dossierAuthoringPage,
        editorPanel,
        visualizationPanel,
        baseVisualization,
        autoNarratives,
        vizGallery,
        toc,
        formatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
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

    it('[TC96070] ACC [Library Web] Check Format panel in dashboard library.', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageWithNLG({
            chapterName: 'Chapter 1',
            pageName: 'Functionality',
        });
        await formatPanel.switchToFormatPanel();
        await autoNarratives.clickWrapTextCheckbox();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96070', '01_Uncheck_WrapText');
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-size': '16px',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'nowrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.checkVIDoclayout('TC96070', '01_Uncheck_WrapText_Image');
        await dossierAuthoringPage.getToolbarBtnByName('Undo').click();
        await autoNarratives.clickAutosizeCheckbox();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96070', '02_WrapText&Autosize');
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-size': '57px',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'wrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.checkVIDoclayout('TC96070', '02_WrapText&Autosize_Image');
        await autoNarratives.maximizeContainer('NLG');
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'wrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96070', '03_MaximizeContainer');
        await dossierAuthoringPage.getToolbarBtnByName('Undo').click();
        await autoNarratives.waitForNlgReady();
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-size': '57px',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'wrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.checkVIDoclayout('TC96070', '03_MaximizeContainer_Undo_Image');
        //Duplicate NLG viz and undo
        await autoNarratives.selectDuplicateOnVisualizationMenu('NLG');
        await since('"NLG copy" should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG copy'))
            .toContain('Delta');
        await dossierAuthoringPage.getToolbarBtnByName('Undo').click();
        await autoNarratives.waitForNlgReady();
        await since('"NLG" should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Delta');

        //Copy and paste formatting
        await autoNarratives.selectCopyFormattingOnVisualizationMenu('NLG');
        await contentsPanel.goToPageWithNLG({
            chapterName: 'Chapter 1',
            pageName: 'Page 1',
        });
        await autoNarratives.selectPasteFormattingOnVisualizationMenu('Visualization 2');
        await autoNarratives.verifySummaryStyleByPos(0, {
            color: 'rgba(0,0,0,1)',
            'font-family': 'open sans',
            'font-style': 'normal',
            'text-wrap': 'wrap',
            'text-align': 'left',
        });
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC96070', '07_PasteFormatting');
        await contentsPanel.goToPageWithNLG({
            chapterName: 'Chapter 1',
            pageName: 'Functionality',
        });
        //Delete NLG and undo
        await autoNarratives.selectDeleteOnVisualizationMenu('NLG');
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC96070', '08_DeleteNLG');
        await dossierAuthoringPage.getToolbarBtnByName('Undo').click();
        await autoNarratives.waitForNlgReady();
        await since('"NLG" should contains #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('NLG'))
            .toContain('Delta');
        //Try to delete viz or move viz to another page
        await baseVisualization.selectDeleteOnVisualizationMenu('SourceGrid');
        await autoNarratives.checkDeleteVizPopupDialog('TC96070', '10_Popup_Dialog');
        await autoNarratives.clickDeleteButton();
        await editorPanel.switchToEditorPanel();
        await autoNarratives.checkEditorPanel('TC96070', '11_ContentDeleted');
        //Try to change the source viz to CompoundGrid
        await dossierAuthoringPage.getToolbarBtnByName('Undo').click();
    });

    it('[TC96070_2] ACC [Library Web] Cross functions.', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await dossierPage.resetDossierIfPossible();
        await toc.openPageFromTocMenu({
            chapterName: 'Chapter 1',
            pageName: 'Page 2_AGGrid',
        });
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPageWithNLG({
            chapterName: 'Chapter 1',
            pageName: 'Functionality',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.checkGallery('viz/AutoNarratives/TC96061', '0_GalleryInsight');
        await autoNarratives.waitForNlgReady();
        await baseVisualization.changeVizType('SourceGrid', 'Grid', 'Compound Grid');
        await baseVisualization.clickVisualizationTitle('NLG');
        await editorPanel.switchToEditorPanel();
        await autoNarratives.checkEditorPanel('viz/AutoNarratives/TC96070_2', '1_ChangeSourceViz_ContentDeleted');
    });
});
