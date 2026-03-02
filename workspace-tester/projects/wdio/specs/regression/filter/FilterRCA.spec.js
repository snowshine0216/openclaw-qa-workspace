import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';
import SearchBoxFilter from '../../../pageObjects/filter/SearchBoxFilter.js';
import InCanvasSelector_Authoring from '../../../pageObjects/authoring/InCanvasSelector_Authoring.js';

const specConfiguration = { ...customCredentials('_filter') };

//npm run wdio -- --baseUrl=https://hanw15949-t.labs.microstrategy.com:8443/MicroStrategyLibrary --spec 'specs/regression/filter/FilterRCA.spec.js' --params.credentials.username=tester_auto
describe('Filter Panel Customer Issue RCA', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };

    const DE327242 = {
        id: 'F4D874268B4D0F2D78CEB5B03DCD0A5C',
        name: 'FSD Country Benchmarking',
        project: tutorialProject,
    };

    const DE323056 = {
        id: '134DEF276A497DBDB398449D3DF13E69',
        name: 'TEST Inncode Dashboard',
        project: tutorialProject,
    };
    
    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        dossierPage,
        filterPanel,
        checkboxFilter,
        searchBoxFilter,
        dynamicFilter,
        radiobuttonFilter,
        inCanvasSelector_Authoring,
        libraryPage,
        loginPage,
        } = browsers.pageObj1;
  
    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99386_01] DE327242 Unspecified error when opening dashboard in Library after upgrade', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DE327242.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();
        //initial status
        await takeScreenshotByElement(
             dossierPage.getDossierView(),
            'DE327242_00',
            'DE327242 initial state'
        );

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Aggregation');
        await radiobuttonFilter.selectElementByName('Selective');
        await filterPanel.apply();
        await takeScreenshotByElement(
             dossierPage.getDossierView(),
            'DE327242_01',
            'DE327242 apply filter 1'
        );

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Selection FY');
        await radiobuttonFilter.selectElementByName('FY23-24');
        await checkboxFilter.openSecondaryPanel('Selection Month');
        await radiobuttonFilter.selectElementByName('May-24');
        await checkboxFilter.openSecondaryPanel('Cust HTS');
        await checkboxFilter.selectElementByName('2:Trader');
        await filterPanel.apply();
        await takeScreenshotByElement(
             dossierPage.getDossierView(),
            'DE327242_02',
            'DE327242 apply multiple filters'
        );

        await filterPanel.openFilterPanel();
        await filterPanel.clearAllFilters();
        await filterPanel.apply();
        await takeScreenshotByElement(
             dossierPage.getDossierView(),
            'DE327242_03',
            'DE327242 clear all filters'
        );
    });

    it('[TC99386_02] DE323056 Cannot search for multiple items separated by a blank space after migrating to MicroStrategy ONE (December 2024).', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DE323056.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        await filterPanel.openFilterPanel();
        await checkboxFilter.openSecondaryPanel('Property - InnCode');
        await searchBoxFilter.search('AAAAA AAHAD DABBF');
        await takeScreenshotByElement(
             dynamicFilter.getSecondaryPanel(),
            'DE323056_01',
            'DE323056 search with space in Filter panel'
        );

        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('AAAAA,AAHAD,DABBF');
        await takeScreenshotByElement(
             dynamicFilter.getSecondaryPanel(),
            'DE323056_02',
            'DE323056 search with comma in Filter panel'
        );
        
        await searchBoxFilter.clearSearch();
        await searchBoxFilter.search('AAAAA OR AAHAD OR DABBF');
        await takeScreenshotByElement(
             dynamicFilter.getSecondaryPanel(),
            'DE323056_03',
            'DE323056 search with OR in Filter panel'
        );

        await filterPanel.closeFilterPanel();
        
        await inCanvasSelector_Authoring.searchBoxSelectorWithoutSelecting('Property - InnCode', 'AAAAA AAHAD DABBF');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'DE323056_04',
           'DE323056 search with space in ICS'
        );

        await inCanvasSelector_Authoring.clearSearchBox('Property - InnCode');
        await inCanvasSelector_Authoring.searchBoxSelectorWithoutSelecting('Property - InnCode', 'AAAAA,AAHAD,DABBF');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'DE323056_05',
           'DE323056 search with comma in ICS'
        );

        await inCanvasSelector_Authoring.clearSearchBox('Property - InnCode');
        await inCanvasSelector_Authoring.searchBoxSelectorWithoutSelecting('Property - InnCode', 'AAAAA OR AAHAD OR DABBF');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
           'DE323056_06',
           'DE323056 search with OR in ICS'
        );
    });

});