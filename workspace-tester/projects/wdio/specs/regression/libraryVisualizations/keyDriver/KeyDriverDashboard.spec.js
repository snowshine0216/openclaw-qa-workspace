import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { botChnUser } from '../../../../constants/bot.js';

describe('KeyDriverDashboardTest', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        TC90183_KeyDriver: {
            id: 'E57D135B4FC1C0A3750FFD96C5EDD688',
            name: 'TC90183_KeyDriver',
        },
        testName: 'KeyDriverDashboardTest',
    };

    let {
        loginPage,
        libraryPage,
        vizGallery,
        contentsPanel,
        dossierEditorUtility,
        editorPanel,
        datasetsPanel,
        formatPanel,
        keyDriverFormatPanel,
        visualizationPanel,
        toolbar,
        keyDriver,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
        // await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        // await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC90183] ACC | Verify the viz gallery, editor panel and viz display in different status for Key Driver visualization in front-end ', async () => {
        // Check Key Driver visualization in gallery
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.TC90183_KeyDriver.id,
        });
        // takeScreenshotBy key driver resizing; factor label texts into two lines
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'changeKDSize',
        });
        // Check tooltips
        await visualizationPanel.takeScreenshotBySelectedViz('TC90183', 'ChangeKDSize');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'keyDriver',
        });
        await keyDriver.hoverOnBar(0);
        await visualizationPanel.takeScreenshotBySelectedViz('TC90183', 'HoverOnBar');
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'emptyPage',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.checkGallery('TC90183', 'DefaultGallery');
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.checkGallery('TC90183', 'GalleryInsight');
        await vizGallery.hoverOnViz('Key Driver');
        await vizGallery.checkGallery('TC90183', 'HoverKeyDriver');
        //Create Key Driver visualization
        await vizGallery.clickOnViz('Key Driver');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC90183', 'AddNewKeyDriver');
        await datasetsPanel.clickSwitchTabButton();
        await since('The dropzone tooltip is expected to be #{expected}, instead we have #{actual}}')
            .expect(await editorPanel.getDropZoneTooltip('More Data Levels'))
            .toBe('Add more attributes to control the data level');
        await since('The dropzone tooltip is expected to be #{expected}, instead we have #{actual}}')
            .expect(await editorPanel.getDropZoneTooltip('Potential Drivers'))
            .toBe('Drag attributes here');
        await since('The dropzone tooltip is expected to be #{expected}, instead we have #{actual}}')
            .expect(await editorPanel.getDropZoneTooltip('Target'))
            .toBe('Drag a metric here');
        await datasetsPanel.doubleClickAttributeMetric('Subcategory');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC90183', 'AddSubcategory');
        await datasetsPanel.doubleClickAttributeMetric('Revenue');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC90183', 'AddRevenue');
        await datasetsPanel.doubleClickAttributeMetric('Region');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC90183', 'AddRegion');
        // await datasetsPanel.addAttributMetricToDropzone('Category', 'More Data Levels');
        // await dossierEditorUtility.takeScreenshotByVIDoclayout('TC90183', '10_AddToMoreDataLevels');
    });

    it('[TC94279]  ACC | Verify the viz format for Key Driver visualization in dossier authoring ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.TC90183_KeyDriver.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'format',
        });
        await formatPanel.switchToFormatPanel();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC94279', 'DefaultFormatPanel');
        await keyDriverFormatPanel.changeIncreaseFactorColor('Rose');
        await keyDriverFormatPanel.changeDecreaseFactorColor('Black');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'ChangeFactorColor');
        // DE271599
        await toolbar.clickButtonFromToolbar('Undo');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'UndoColorChange');
        await toolbar.clickButtonFromToolbar('Redo');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'RedoColorChange');
        // DE271581
        await visualizationPanel.clickTitleBar('Visualization 1');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'SelectViz1');
        await visualizationPanel.clickTitleBar('KeyDriver');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'SelectKeyDriver');
        //Check the title and container tab
        await formatPanel.switchToTitleAndContainerTab();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC94279', 'TitleContainerTab');
        // DE271615: freeform layout with invalid value for Position And Size
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'freeform',
        });
        await formatPanel.switchToTitleAndContainerTab();
        await formatPanel.setValueForPositionX('-100');
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94279', 'InvalidPositionX');
    });

    it('[TC94590] i18N | Verify the i18N case for Key Driver visualization in dashboard. ', async () => {
        await loginPage.relogin(consts.vizUser_chn.credentials);
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.TC90183_KeyDriver.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'keyDriver',
        });
        await formatPanel.switchToFormatPanel();
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC94590', 'FormatPanel');
        await editorPanel.switchToEditorPanel();
        await dossierEditorUtility.takeScreenshotByVIDoclayout('TC94590', 'EditorPanel');
        await keyDriver.hoverOnBar(0);
        await visualizationPanel.takeScreenshotBySelectedViz('TC94590', 'HoverOnBar');
    });
});
