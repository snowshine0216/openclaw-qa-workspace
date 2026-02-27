import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';

const specConfiguration = { ...customCredentials('') };

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --params.credentials.username=tqmsuser params.credentials.password=ddset --tcList=TC99138
describe('Custom No Data Str', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const AutoCustomNoDataObject = {
        id: '07C72E8FDA453E78FE394C93869BFC46',
        name: 'Auto_CustomNoDataStr',
        project: tutorialProject,
    };
    const AutoCustomNoDataModified = {
        id: '07721AE5104BD55C0E239785E3942286',
        name: 'Auto_CustomNoDataStr_Modified',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let { dossierPage, libraryPage, dossierAuthoringPage, loginPage, baseVisualization } = browsers.pageObj1;

    beforeEach(async () => {
        if (!(await loginPage.isLoginPageDisplayed())) {
            await browser.url(new URL('auth/ui/loginPage', browser.options.baseUrl).toString(), 100000);
        }
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99138] Custom No Data Message E2E', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${AutoCustomNoDataObject.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        //1. Check default no data string (without customization)
        let defaultStr = 'No data returned for this view. This might be because the applied filter excludes all data.';
        await since('AGGrid should be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getVizErrorContent('AGGrid'))
            .toBe(defaultStr);
        await since('Line should be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getVizErrorContent('Line'))
            .toBe(defaultStr);
        await since('Custom Viz should be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getVizErrorContent('Custom Viz - Word cloud'))
            .toBe(defaultStr);
        await since('Map should be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getVizErrorContent('Map'))
            .toBe(defaultStr);
        await since('Mapbox should be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getVizErrorContent('Mapbox'))
            .toBe(defaultStr);
        await since('Mapbox with no object should NOT be no data initially, expected #{expected}, but now #{actual}')
            .expect(await baseVisualization.getErrCount(defaultStr))
            .toBe(5);

        //2. Custom No Data Msg
        let customNoDataMsg = 'Test\nNoDataMsg';
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Dashboard Properties');
        await dossierAuthoringPage.clickOnCheckboxWithTitle('No Data Returned');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDashboardPropertiesEditor(),
            'TC99138_1_01',
            'Dashboard Properties Editor'
        );
        //2.1 Check Reset button
        await dossierAuthoringPage.inputNoDataText(customNoDataMsg);
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getNoDataResetBtn());
        await since('No Data Reset button should be enabled #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.getNoDataResetBtn().isDisplayed())
            .toBe(true);
        await since('No Data String could should be expected #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.getNoDataTextCount().getText())
            .toBe('15/1000');
        await dossierAuthoringPage.clickTextFormatBtn('bold');
        await since('Bold icon should be selected expected #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.isNoDataFormatButtonSelected('bold'))
            .toBe(true);
        await dossierAuthoringPage.getNoDataResetBtn().click();
        await dossierAuthoringPage.waitForElementVisible(dossierAuthoringPage.getNoDataResetBtn(false));
        await since('No Data Reset button should be disabled #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.getNoDataResetBtn(false).isDisplayed())
            .toBe(true);
        await since('Bold icon should be selected expected #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.isNoDataFormatButtonSelected('bold'))
            .toBe(false);
        await since('No Data String could should be expected #{expected} but now #{actual}')
            .expect(await dossierAuthoringPage.getNoDataTextCount().getText())
            .toBe('91/1000');
        //2.2 Customization and save
        await dossierAuthoringPage.inputNoDataText(customNoDataMsg);
        await dossierAuthoringPage.clickTextFormatBtn('bold');
        await dossierAuthoringPage.clickTextFormatBtn('italic');
        await dossierAuthoringPage.clickTextFormatBtn('underline');
        await dossierAuthoringPage.changeNoDataTextColor('#FF3729');
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDashboardPropertiesEditor(),
            'TC99138_1_02',
            'Dashboard Properties Editor with Preview'
        );
        await dossierAuthoringPage.clickBtnWithLabel('OK');

        //Check the custom no data string on authoring mode
        await takeScreenshotByElement(
            await dossierAuthoringPage.getDossierView(),
            'TC99138_1_03',
            'Custom No Data String should be displayed in authoring mode'
        );

        //Check the custom no data string on consumption mode
        await dossierAuthoringPage.saveAsNewObject('Auto_CustomNoDataStr_Modified');
        await dossierAuthoringPage.clickCloseDossierButton();
        const url2 = browser.options.baseUrl + `app/${tutorialProject.id}/${AutoCustomNoDataModified.id}`;
        await libraryPage.openDossierByUrl(url2.toString());
        await takeScreenshotByElement(
            await dossierPage.getDossierView(),
            'TC99138_1_04',
            'Custom No Data String should be displayed in consumption mode'
        );
    });
});
export const config = specConfiguration;
