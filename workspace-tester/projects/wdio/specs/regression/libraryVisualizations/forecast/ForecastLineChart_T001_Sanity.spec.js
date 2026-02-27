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
            id: '8B25F1CAEB4A611E501FACAB4DF25282',
            name: 'ForcastLineChart_T001_Sanity',
        },
        testName: 'ForcastLineChart_T001_Sanity',
    };

    let {
        loginPage,
        libraryPage,
        dossierPage,
        contentsPanel,
        vizGallery,
        dossierEditorUtility,
        visualizationPanel,
        datasetsPanel,
        formatPanel,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.autoUser.credentials);
        await loginPage.disableTutorial();
        await setWindowSize(browserWindowCustom);
    });

    afterAll(async () => {
        await logoutFromCurrentBrowser();
    });

    it('[TC98433] Verify the ForcastLineChart visualization in dossier auto dashboard ', async () => {
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.trendLine.id,
        });
        await contentsPanel.goToPage({
            chapterName: 'Chapter 1',
            pageName: 'addTrendLine',
        });

        await vizGallery.clickOnInsertVI();
        await vizGallery.clickOnVizCategory('Insight');
        await vizGallery.clickOnViz('Forecast Line Chart');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98433', '00_AddForecastLineChart', {tolerance: 3});
        await visualizationPanel.takeScreenshotBySelectedViz('TC98433', '01_AddForecastLineChart', {tolerance: 3});

        await datasetsPanel.clickSwitchTabButton();
        await datasetsPanel.doubleClickAttributeMetric('City');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Month_Date');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);
        await datasetsPanel.doubleClickAttributeMetric('Cost');
        await formatPanel.loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await dossierPage.sleep(1000);
        await visualizationPanel.takeScreenshotBySelectedViz('TC98433', '00_DoubleClickAddDropZone', {tolerance: 3});
        await dossierEditorUtility.takeScreenshotByVIBoxPanel('TC98433', '01_DoubleClickAddDropZone', {tolerance: 3});
    });
});
