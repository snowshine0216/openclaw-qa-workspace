import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';
import { dossier } from '../../../../constants/teams.js';
// import BaseVisualization from '../../../../pageObjects/base/BaseVisualization.js';

describe('CustomVizHTMLSanity', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        ContentLevel_On: {
            id: '1D613DF5FB46DCDC71E46FBF162AF93C',
            name: 'ContentLevel_On',
        },
        ContentLevel_Off: {
            id: '94B458E97C4F47B5FE645DB2E251756C',
            name: 'ContentLevel_Off',
        },
    };

    let { loginPage, libraryPage, dossierPage, autoNarratives, contentsPanel, keyDriver, toc, baseVisualization } =
        browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.vizAdmin.credentials);
        await loginPage.disableTutorial();
        await loginPage.disablePendoTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC93604_1] E2E | Verify custom visualizations with HTML elements', async () => {
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.ContentLevel_On.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'MMKPI' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '01_ContentLevelOn_MMKPI');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'ComparisonKPI' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '02_ContentLevelOn_ComparisonKPI');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Gauge' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '03_ContentLevelOn_Gauge');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Sankey' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '04_ContentLevelOn_Sankey');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'TimeSeries' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '05_ContentLevelOn_TimeSeries');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '06_ContentLevelOn_KeyDriver');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '07_ContentLevelOn_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC93604_1', '08_ContentLevelOn_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await since('NLG targeting Grid should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('delay');
    });

    it('[TC93604_2] E2E | Verify custom visualizations with HTML elements', async () => {
        await logoutFromCurrentBrowser();
        await libraryPage.openDefaultApp();
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.ContentLevel_Off.id);
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'MMKPI' });
        // eslint-disable-next-line prettier/prettier
        await dossierPage.takeScreenshotByDocView(
            'TC93604_2',
            '01_ContentLevelOn_MMKPI'
        );
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'ComparisonKPI' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '02_ContentLevelOn_ComparisonKPI');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Gauge' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '03_ContentLevelOn_Gauge');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Sankey' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '04_ContentLevelOn_Sankey');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'TimeSeries' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '05_ContentLevelOn_TimeSeries');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'KeyDriver' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '06_ContentLevelOn_KeyDriver');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Forecast' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '07_ContentLevelOn_Forecast');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'Trend' });
        await dossierPage.takeScreenshotByDocView('TC93604_2', '08_ContentLevelOn_Trend');
        await toc.openPageFromTocMenuWait({ chapterName: 'Chapter 1', pageName: 'NLG' });
        await autoNarratives.waitForNlgReady(1);
        await since('NLG targeting Grid should contain #{expected}, while we get #{actual}')
            .expect(await autoNarratives.getSummaryTextByIndex())
            .toContain('delay');
    });
});
