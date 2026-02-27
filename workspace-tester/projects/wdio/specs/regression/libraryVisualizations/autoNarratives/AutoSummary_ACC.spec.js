import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('AutoSummary_ACC', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial Project',
        },
        dashboard: {
            id: 'C5DF2CD0DB49D5BACA6E448F866469B4',
            name: 'AutoSummary_ACC',
        },
        application: {
            id: 'config/E35F4003C5EE4B1CB5D36CAEC37F62F9/235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'ABANoAutoSummary',
        },
        testName: 'AutoSummary_ACC',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        dossierEditorUtility,
        toc,
        pieChart,
        autoNarratives,
        editorPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.enableABAlocator();
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

    it('[F43676_4] ACC | Auto Summary Main Workflow', async () => {
        // Open dashboard in edit mode
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.dashboard.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'NoAutoSummary',
        });
        await autoNarratives.clickAutoSummaryIcon();
        await autoNarratives.waitForNlgReady();
        await editorPanel.switchToEditorPanel();
        await autoNarratives.clickDisplayInConsumption();
        await since('Display in consumption check status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isDisplayInConsumptionChecked())
            .toBe(false);
        await autoNarratives.clickDisplayInConsumption();
        await since('Display in consumption check status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isDisplayInConsumptionChecked())
            .toBe(true);
        await autoNarratives.clickAutoSummaryExpandButton();
        await since('1.Auto Summary Expand status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isAutoSummaryExpand())
            .toBe(true);
        await autoNarratives.clickAutoSummaryExpandButton();
        await since('2.Auto Summary Expand status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isAutoSummaryExpand())
            .toBe(false);
        await autoNarratives.clickAutoSummaryCopyButton();
        await autoNarratives.validateClipboardContains(`Summary`);
        await autoNarratives.clickAutoSummaryCloseButton();
        await since('1.the Auto Summary Icon selected status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isAutoSummaryIconSelected())
            .toBe(false);
        await autoNarratives.clickAutoSummaryIcon();
        await autoNarratives.waitForNlgReady();
        await since('2.Auto Summary Icon selected status should be #{expected}, while we get #{actual}')
            .expect(await autoNarratives.isAutoSummaryIconSelected())
            .toBe(true);
    });
});
