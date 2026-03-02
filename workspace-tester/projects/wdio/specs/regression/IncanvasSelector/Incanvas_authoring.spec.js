import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import setWindowSize from '../../../config/setWindowSize.js';



const specConfiguration = { ...customCredentials('_authoring') };

describe('Incanvas selector authoring with different types', () => {
    const tutorialProject = {
        id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
        name: 'MicroStrategy Tutorial',
    };
    const Dossier = {
        id: 'B90CB5234CAFFF85532C8499071E1A48',
        name: 'In-canvas selector with different types',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };


    const { credentials } = specConfiguration;

    let {
        dossierPage,
        toc,
        libraryPage,
        grid,
        textbox,
        imageContainer,
        loginPage,
        libraryAuthoringPage,
        dossierAuthoringPage,
        linkEditor,
        promptEditor,
        baseVisualization,
        contextualLinkEditor,
        contentsPanel,
        inCanvasSelector_Authoring,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(specConfiguration.credentials);
        await setWindowSize(browserWindow);
    });

    
    afterEach(async () => {
        await dossierAuthoringPage.closeDossierWithoutSaving();
        await dossierPage.goToLibrary();
    });

    

    it('[TC80605_01] verify create element/value filter', async () => {

        // go into authoring mode
        await libraryPage.openDossier(Dossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        // create element value filter and select targe
        await contentsPanel.goToPage({ chapterName: 'ICS', pageName: 'Element/Value' });
        await inCanvasSelector_Authoring.createNewElementFilter();
        await inCanvasSelector_Authoring.dragDSObjectToSelector('attribute', 'Category', 'DS', 0)
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Visualization 1', 'Category');

        // make selections and check target data
        await inCanvasSelector_Authoring.linkOrButtonBarSelector('Category', 'Books');
        since('after change element ics, the target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014','Jan 2014', 'Electronics','Audio Equipment','North','$15,336', '$18,960']);

    });

    it('[TC80605_02] verify create attribute/metric filter', async () => {

        // go into authoring mode
        await libraryPage.openDossier(Dossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        // create metric filter and select targe
        await contentsPanel.goToPage({ chapterName: 'ICS', pageName: 'Attribute/Metric' });
        await inCanvasSelector_Authoring.createNewAttributeMetricFilter();
        await inCanvasSelector_Authoring.dragDSObjectToSelector('metric', 'Cost', 'DS', 0)
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Visualization 1', 'Selector', 'Profit');

        // make selections and check target data
        await inCanvasSelector_Authoring.checkElementListByIndex(1, 'Cost');
        since('after change metric ics, the target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year','Month', 'Category','Subcategory','CustomerRegion','Cost', 'Revenue']);
        await inCanvasSelector_Authoring.checkElementListByIndex(1, 'Profit');
        since('after change metric ics, the target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Year','Month', 'Category','Subcategory','CustomerRegion','Profit', 'Revenue']);

    });


    it('[TC80605_03] verify create panel filter', async () => {

        // go into authoring mode
        await libraryPage.openDossier(Dossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        // create panel filter and select targe
        await contentsPanel.goToPage({ chapterName: 'ICS', pageName: 'Panel' });
        await inCanvasSelector_Authoring.createNewPanelFilter();
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Panel Stack', 'Panel Selector');

        // make selections and check target data
        await inCanvasSelector_Authoring.checkElementListByIndex(1, 'Panel 1', true);
        since('after change panel ics, the target selected panel should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.getSelectedPanelText())
            .toBe('This is panel 1');
            
        await inCanvasSelector_Authoring.checkElementListByIndex(1, 'Panel 2', true);
        since('after change panel ics, the target selected panel should be #{expected}, instead we have #{actual}')
            .expect(await inCanvasSelector_Authoring.getSelectedPanelText())
            .toBe('This is panel 2');
    });

    it('[TC80605_04] verify create parameter filter', async () => {

        // go into authoring mode
        await libraryPage.openDossier(Dossier.name);
        await libraryAuthoringPage.editDossierFromLibrary();
        // create panel filter and select targe
        await contentsPanel.goToPage({ chapterName: 'ICS', pageName: 'Parameter' });
        await inCanvasSelector_Authoring.createNewParameterFilter();
        await inCanvasSelector_Authoring.dragDSObjectToSelector('parameter', 'CategoryParameter', 'Dashboard Parameters', 0)

        // make selections and check target data
        await inCanvasSelector_Authoring.linkOrButtonBarSelector('CategoryParameter', 'Books');
        since('after change parameter ics, the target grid data should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 2))
            .toEqual(['2014','Jan 2014', 'Electronics','Audio Equipment','North','$15,336', '$18,960']);
    });

});
export const config = specConfiguration;
