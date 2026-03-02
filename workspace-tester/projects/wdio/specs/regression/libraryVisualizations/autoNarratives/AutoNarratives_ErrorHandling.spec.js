import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { takeScreenshotByElement } from '../../../../utils/TakeScreenshot.js';

describe('AutoNarratives_Errorhandling', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        NLG: {
            id: 'E7DF0CCA460C5540CA4813A531D01743',
            name: 'NLG_Fun',
        },
        NLG_Consolidation: {
            id: '8197ADE643E0681AFB562298ED3C7498',
            name: 'NLG_Consolidation',
        },
        NLG_CG: {
            id: 'C400DF7E4C37A36101D9B89A1CE6560E',
            name: 'NLG_CG',
        },
        testName: 'AutoNarratives_Errorhandling',
    };

    let { loginPage, libraryPage, dossierPage, autoNarratives, vizGallery, baseVisualization, toc, contentsPanel } =
        browsers.pageObj1;

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

    it('[TC96071] FUN [Library Web] Check error handling in dashboard library.', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG_Consolidation.id);
        await autoNarratives.waitForNlgReady(1);
        await since('Page 1 summary text title should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 2'))
            .toContain('$103,120');

        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG_CG.id);
        await autoNarratives.waitForNlgReady(1);
        await since('Page 1 summary text title should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByVizTitle('Visualization 2'))
            .toContain('10,878,320');
        await dossierPage.goToLibrary();

        //Open NLG without 'Use Auto Assistant and ML Visualizations' priviledge
        await libraryPage.switchUser(consts.noSort.credentials);
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.NLG.id);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Functionality' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC96071', '01_NoPriviledge');

        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.NLG.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'Functionality',
        });
        await vizGallery.clickOnInsertVI();
        await vizGallery.checkGallery('TC96071', '02_NoGalleryInsight');
        await baseVisualization.openMenuOnVisualization('SourceGrid');
        await since('[Create Auto Narratives] option is expected to be #{expected}, instead we have #{actual}.')
            .expect(await baseVisualization.isContextMenuOptionPresent({ level: 1, option: 'Create Auto Narratives' }))
            .toBe(false);
    });
});
