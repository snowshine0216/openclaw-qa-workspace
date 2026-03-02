import { browserWindowCustom } from '../../../../constants/index.js';
import logoutFromCurrentBrowser from '../../../../api/logoutFromCurrentBrowser.js';
import setWindowSize from '../../../../config/setWindowSize.js';
import * as consts from '../../../../constants/visualizations.js';

describe('KeyDriverLockedPageTest', () => {
    const testObjectInfo = {
        project: {
            id: '235853DC4B79DABCE8C6FFB26B7D8DC3',
            name: 'MicroStrategy Tutorial',
        },
        responsive_objects: {
            Screen4vs3: {
                name: '4vs3',
                id: '26EB3C9E492B5503D3D11CBE1900A9DC',
            },
            Screen16vs9: {
                id: '88FB99B749313419D846B0B19E7163BF',
                name: '16vs9',
            },
            WideScreen: {
                id: '9C2E0ACB054A40F074829C91EEDB850B',
                name: 'WideScreen',
            },

            Custom: {
                id: 'D23708AE47183882E653B7BE150AE259',
                name: 'Custom',
            },
        },
        testName: 'KeyDriverLockedPageTest',
    };

    let { loginPage, libraryPage, dossierEditorUtility, dossierPage, keyDriver } = browsers.pageObj1;

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

    it('[TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library authoring. ', async () => {
        //Open keydriver dashboard in library authoring
        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.responsive_objects.Screen4vs3.id,
        });
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC94357', '01_PageSize_Screen4vs3');
        await keyDriver.hoverOnBar(0);
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC94357', '01_PageSize_Screen4vs3_HoverOnBar');

        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.responsive_objects.Screen16vs9.id,
        });
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC94357', '02_PageSize_Screen16vs9');

        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.responsive_objects.WideScreen.id,
        });
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC94357', '03_PageSize_WideScreen');

        await libraryPage.editDossierByUrl({
            projectId: testObjectInfo.project.id,
            dossierId: testObjectInfo.responsive_objects.Custom.id,
        });
        await dossierEditorUtility.takeScreenshotByVIVizPanel('TC94357', '04_PageSize_Custom');
    });

    it('[TC94357] E2E | Library | Verify KeyDriver basic static rendering in locked mode in Library consumption. ', async () => {
        //Library consumption to cover view mode: Fit to View, Fill the View, zoom to 100%
        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.responsive_objects.Screen4vs3.id);
        await dossierPage.takeScreenshotByDocView('TC94357', '05_PageSize_Screen4vs3_FitToView');
        await keyDriver.hoverOnIncreaseBar(0);
        await dossierPage.takeScreenshotByDocView('TC94357', '06_PageSize_Screen4vs3_FitToView_HoverOnIncreaseBar');
        await keyDriver.hoverOnDecreaseBar(1);
        await dossierPage.takeScreenshotByDocView('TC94357', '07_PageSize_Screen4vs3_FitToView_HoverOnDecreaseBar');

        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.responsive_objects.Custom.id);
        await dossierPage.takeScreenshotByDocView('TC94357', '08_PageSize_Custom_FillTheView');
        await keyDriver.hoverOnIncreaseBar(2);
        await dossierPage.takeScreenshotByDocView('TC94357', '09_PageSize_Custom_FillTheView_HoverOnIncreaseBar');
        await keyDriver.hoverOnDecreaseBar(1);
        await dossierPage.takeScreenshotByDocView('TC94357', '10_PageSize_Custom_FillTheView_HoverOnDecreaseBar');

        await libraryPage.openUrl(testObjectInfo.project.id, testObjectInfo.responsive_objects.WideScreen.id);
        await dossierPage.takeScreenshotByDocView('TC94357', '11_PageSize_WideScreen_ZoomTo100');
        await keyDriver.hoverOnIncreaseBar(2);
        await dossierPage.takeScreenshotByDocView('TC94357', '12_PageSize_WideScreen_ZoomTo100_HoverOnIncreaseBar');
        await keyDriver.hoverOnDecreaseBar(3);
        await dossierPage.takeScreenshotByDocView('TC94357', '13_PageSize_WideScreen_ZoomTo100_HoverOnDecreaseBar');
    });
});
