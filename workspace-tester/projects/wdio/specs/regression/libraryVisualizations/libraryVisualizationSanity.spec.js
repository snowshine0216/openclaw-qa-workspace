import { browserWindowCustom } from '../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../config/setWindowSize.js';
import * as consts from '../../../constants/visualizations.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

describe('Library Visualization Sanity', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        allViz: {
            id: '33BB0E5F49D88DF3E583C2B3C6FBBF3A',
            name: 'AllViz_CSPCompliant_23.12_ABA',
        },
        testName: 'LibraryVisualizationSanity',
    };

    let { loginPage, libraryPage, dossierPage, toc } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await setWindowSize(browserWindowCustom);
        await libraryPage.openDebugMode(consts.codeCoverage.vizDebugBundles);
    });

    afterEach(async () => {
        await libraryPage.collectLineCoverageInfo(consts.codeCoverage.vizOutputFolder, testObjectInfo.testName);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC92806] E2E | Library | Verify basic static rendering for all visualizations. ', async () => {
        // Check Tooltip, RMC context menu for Grid in Bot, Snapshot.
        await libraryPage.openUrlAndCancelAddToLibrary(testObjectInfo.project.id, testObjectInfo.allViz.id);
        await toc.openPageFromTocMenu({ chapterName: 'CustomVis', pageName: 'SequenceSunburst' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '00_SequenceSunburst', 1);
        await toc.openPageFromTocMenu({ chapterName: 'CustomVis', pageName: 'OldKPI' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '01_OldKPI', 1);
        await toc.openPageFromTocMenu({ chapterName: 'CustomVis', pageName: 'GoogleTimeline' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '02_GoogleTimeline');
        await toc.openPageFromTocMenu({ chapterName: 'Graph Matrix', pageName: 'ABL' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '03_ABL');
        await toc.openPageFromTocMenu({ chapterName: 'Graph Matrix', pageName: 'Combo' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '04_Combo');
        await toc.openPageFromTocMenu({ chapterName: 'Graph Matrix', pageName: 'Bubble' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '05_Bubble');
        await toc.openPageFromTocMenu({ chapterName: 'Graph Matrix', pageName: 'Pie' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '06_Pie');
        await toc.openPageFromTocMenu({ chapterName: 'Map', pageName: 'Mapbox' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '07_Mapbox');
        await toc.openPageFromTocMenu({ chapterName: 'Map', pageName: 'Esri' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '08_Esri');
        await toc.openPageFromTocMenu({ chapterName: 'OOTB Vis', pageName: 'Heatmap' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '09_Heatmap');
        await toc.openPageFromTocMenu({ chapterName: 'OOTB Vis', pageName: 'Network' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '10_Network');
        await toc.openPageFromTocMenu({ chapterName: 'OOTB Vis', pageName: 'KPI' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '11_KPI');
        await toc.openPageFromTocMenu({ chapterName: 'OOTB Vis', pageName: 'Imagelayout' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '12_KPI');
        await toc.openPageFromTocMenu({ chapterName: 'Others', pageName: 'OOTB' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '13_OOTB');
        await toc.openPageFromTocMenu({ chapterName: 'Others', pageName: 'CustomViz' });
        await takeScreenshotByElement(dossierPage.getDossierView(), 'TC92806', '14_CustomViz');
    });
});
