import resetDossierState from '../../../api/resetDossierState.js';
import setWindowSize from '../../../config/setWindowSize.js';
import { customCredentials } from '../../../constants/index.js';

const specConfiguration = { ...customCredentials('_AI') };

describe('Context for AI chatbot', () => {
    const project = {
        id: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
        name: 'MicroStrategy Tutorial',
    };

    const maximizeDossier = {
        id: 'B8526B734C61A5FA4A8A748D9A9767E3',
        name: '(AUTO) AI Dossier Context - Auto selected',
        project,
    };

    const PSDossier = {
        id: 'FA26C131400C28122BAFBD8599B9C14F',
        name: '(AUTO) AI Dossier Context - panel stack',
        project,
    };

    const nonvizDossier = {
        id: '0A78AD4E4255A86C939C49B3881FA513',
        name: '(AUTO) AI Dossier Context - no viz',
        project,
    };

    const vizDossier = {
        id: 'FCD448414BD4C7590BF1EBB154051D18',
        name: '(AUTO) AI Dossier Context - Grid',
        project,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    const {
        loginPage,
        dossierPage,
        libraryPage,
        toc,
        pieChart,
        lineChart,
        waterfall,
        grid,
        aiAssistant,
        inCanvasSelector,
    } = browsers.pageObj1;
    const { credentials } = specConfiguration;

    beforeAll(async () => {
        await loginPage.login(credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC91139] AI Assistant - Auto select as context', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: maximizeDossier,
        });

        // open dossier with one maximized viz
        await libraryPage.openDossier(maximizeDossier.name);
        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await aiAssistant.sleep(1000);
        await since('Open dossier with maximized viz, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since('Open dossier with maximized viz, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid');

        // switch to page with two maximized viz
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'two maximized viz' });
        await since(
            'Switch to page with two maximized viz, viz1 selected should be #{expected}, while we get #{actual}'
        )
            .expect(await grid.isContainerSelected('Visualization 1'))
            .toBe(false);
        await since(
            'Switch to page with two maximized viz, viz2 selected should be #{expected}, while we get #{actual}'
        )
            .expect(await grid.isContainerSelected('Visualization 2'))
            .toBe(false);
        await since(
            'Switch to page with two maximized viz, AI context present should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // switch to page with one maximized viz
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'one maximized viz' });
        await since(
            'Switch to page with one maximized viz, Grid selected should be #{expected}, while we get #{actual}'
        )
            .expect(await grid.isContainerSelected('viz1'))
            .toBe(true);
        await since(
            'Switch to page with one maximized viz, selected context should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.getContext())
            .toBe('viz1');

        // change panel stack
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 12');
        await since('Change panel stack, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('viz2'))
            .toBe(false);
        await since('Change panel stack, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 11');
        await since('Change panel stack back, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('viz1'))
            .toBe(false);
        await since('Change panel stack back, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // switch back to first page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await since(
            'switch back to page with maximized viz, Grid selected should be #{expected}, while we get #{actual}'
        )
            .expect(await grid.isContainerSelected('Grid'))
            .toBe(true);
        await since(
            'switch back to page with maximized viz, selected context should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.getContext())
            .toBe('Grid');
    });

    it('[TC91140] AI Assistant - Select/Keep context - different entries in viz to select context', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: maximizeDossier,
        });
        await libraryPage.openDossier(maximizeDossier.name);
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'line and pie' });
        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        // RMC on pie
        await pieChart.keepOnly({ title: 'Pie', slice: '2016' });
        await dossierPage.waitForDossierLoading();
        await since('RMC viz, pie selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Pie'))
            .toBe(false);
        await since('RMC viz, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // Clear view filter
        await grid.openViewFilterContainer('Pie');
        await grid.clearViewFilter('Clear All');
        await dossierPage.waitForDossierLoading();
        await since('Clear view filter, pie selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Pie'))
            .toBe(true);
        await since('Clear view filter, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Pie');

        // keep only
        await pieChart.keepOnly({ title: 'Pie', slice: '2016' });
        await since('keep only, pie selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Pie'))
            .toBe(true);
        await since('keep only, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Pie');

        // switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'freeform layout' });
        await aiAssistant.waitForAIReady();

        // select line by click On YAxis
        await lineChart.clickOnYAxis('FreeformLine');
        await since('Click viz YAxis, FreeformLine selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('FreeformLine'))
            .toBe(true);
        await since('Click viz YAxis, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('FreeformLine');

        // Sort Ascending on XAxis
        await lineChart.selectXAxisContextMenuOption({ vizName: 'FreeformLine', firstOption: 'Sort Descending' });
        await since('Sort Ascending on XAxis, FreeformLine selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('FreeformLine'))
            .toBe(true);
        await since('Sort Ascending on XAxis, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('FreeformLine');

        // switch page
        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'waterfall' });
        await aiAssistant.waitForAIReady();
        // click on waterfall YAxis
        await waterfall.clickOnYAxisLabel('Waterfall');
        await since('Click on YAxis, waterfall selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Waterfall'))
            .toBe(true);
        await since('Click on YAxis, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Waterfall');

        // sort descending on YAxis
        await waterfall.selectYAxisContextMenuOption({ vizName: 'Waterfall', firstOption: 'Sort Descending' });
        await since('Sort descending on YAxis, waterfall selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Waterfall'))
            .toBe(true);
        await since('Sort descending on YAxis, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Waterfall');
    });

    it('[TC91256] AI Assistant - manipulation on dossier - panel stack', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: PSDossier,
        });
        await libraryPage.openDossier(PSDossier.name);
        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });

        // click grid not in panel stack
        await grid.selectGridElement({ title: 'Grid1', headerName: 'Year' });
        await since('Click grid, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid1'))
            .toBe(true);
        await since('Click grid, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid1');

        // switch panel stack by selector
        await inCanvasSelector.selectItem('Panel 1');
        await since('Switch panel stack by selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid1'))
            .toBe(true);
        await since('Switch panel stack by selector, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid1');

        // switch panel stack by panel name
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 4');
        await since('Switch panel stack by selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid1'))
            .toBe(true);
        await since('Switch panel stack by selector, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid1');

        // click grid in panel3
        await grid.sleep(1000); // wait selected status completed due to delay mechanism
        await grid.selectGridElement({ title: 'Grid2', headerName: 'Subcategory' });
        await since('Click grid in panel stack, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid2'))
            .toBe(true);
        await since('Click grid in panel stack, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Grid2');

        // switch other panel stack by selector
        await inCanvasSelector.selectItem('Panel 2');
        await since('Switch other panel stack by selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid2'))
            .toBe(true);
        await since(
            'Switch other panel stack by selector, selected context should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.getContext())
            .toBe('Grid2');

        // switch current panel stack by panel name
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 3');
        await since('Switch current stack by selector, Pie selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Pie'))
            .toBe(false);
        await since(
            'Switch current stack by selector, AI context present should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 4');
        await since('Switch current stack by selector, Grid selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Grid2'))
            .toBe(false);
        await since(
            'Switch current stack by selector, AI context present should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // switch current panel stack by panel name
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 1');
        await since('Switch current stack by selector, KPI selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('KPI'))
            .toBe(false);
        await since(
            'Switch current stack by selector, AI context present should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
        await dossierPage.clickDossierPanelStackSwitchTab('Panel 2');
        await since('Switch current stack by selector, Line selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Line'))
            .toBe(false);
        await since(
            'Switch current stack by selector, AI context present should be #{expected}, while we get #{actual}'
        )
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
    });

    it('[TC91142] AI Assistant - not select non-vis as context', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: nonvizDossier,
        });
        await libraryPage.openDossier(nonvizDossier.name);
        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();
        await since('open non-viz dossier, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // click image
        await dossierPage.clickImage();
        await since('click image, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // click text
        await dossierPage.clickTextfieldByTitle('Text');
        await since('click text, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // click shape
        await dossierPage.clickShape();
        await since('click shape, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);

        // click shape
        await dossierPage.clickShape();
        await since('click shape, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
    });

    it('[TC94994] AI Assistant - Manipulation on viz inside bot should not dismiss the context', async () => {
        await resetDossierState({
            credentials: credentials,
            dossier: vizDossier,
        });
        await libraryPage.openDossier(vizDossier.name);

        // open AI assistant
        await aiAssistant.open();
        await aiAssistant.pin();

        await toc.openPageFromTocMenu({ chapterName: 'viz', pageName: 'Line' });
        await aiAssistant.sleep(1000);

        await lineChart.clickOnYAxis('Line Chart');
        await since('Select viz, viz selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Line Chart'))
            .toBe(true);
        await since('Select viz, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Line Chart');

        // ask question
        await aiAssistant.input(`Sort the profit by year`);

        await aiAssistant.sendQuestionAndWaitForAnswer();
        await aiAssistant.sleep(2000);
        await aiAssistant.clickLatestVizInsideBot();
        await since('Click grid inside bot, viz selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Line Chart'))
            .toBe(true);
        await since('Click grid inside bot, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(true);
        await since('Click grid inside bot, selected context should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.getContext())
            .toBe('Line Chart');

        //deselect viz
        await lineChart.clickVisualizationTitle('Line Chart');
        await since('Deselect viz, viz selected should be #{expected}, while we get #{actual}')
            .expect(await grid.isContainerSelected('Line Chart'))
            .toBe(false);
        await since('Deselect viz, AI context present should be #{expected}, while we get #{actual}')
            .expect(await aiAssistant.isContextPresent())
            .toBe(false);
    });
});

export const config = specConfiguration;
