import { customCredentials } from '../../../constants/index.js';
import * as consts from '../../../constants/visualizations.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/classicGrid/NormalGrid_E2E.spec.js'
describe('Normal Grid E2E workflows', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'New MicroStrategy Tutorials',
    };
    const NormalGridE2E = {
        id: 'A25FAE72794992E892CF30AED97F7971',
        name: 'Normal Grid E2E',
        project: tutorialProject,
    };

    const NormalGridE2ESaveAs = {
        id: '213A711B7D4EBC56079BFA9521136438',
        name: 'Normal Grid E2E Test Save As',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1200,
        height: 800,
    };

    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    let {
        libraryAuthoringPage,
        libraryPage,
        dossierPage,
        baseFormatPanel,
        baseFormatPanelReact,
        newFormatPanelForGrid,
        baseContainer,
        editorPanelForGrid,
        dossierAuthoringPage,
        showDataDialog,
        vizPanelForGrid,
        dossierMojo,
        datasetPanel,
        loginPage,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99177] Create a normal grid', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        //Drag objects into grid container and dropzones to create the normal grid
        await vizPanelForGrid.dragDSObjectToGridDZ('Year', 'attribute', 'New Dataset 1', 'Rows');
        await vizPanelForGrid.dragDSObjectToGridDZ('Cost', 'metric', 'New Dataset 1', 'Metrics');
        await vizPanelForGrid.dragDSObjectToGridContainer('Region', 'attribute', 'New Dataset 1', 'Visualization 1');
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Profit', 'metric', 'New Dataset 1');

        await since('The editor panel should have the items "Year" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Year', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Region" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Region', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Category" in the "Rows" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Category', 'Rows').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Cost" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Metrics').isDisplayed())
            .toBe(true);
        await since('The editor panel should have the items "Profit" in the "Metrics" zone')
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Profit', 'Metrics').isDisplayed())
            .toBe(true);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$77,012');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$21,190');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$67,627');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$18,403');
        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(2000);
        await libraryAuthoringPage.saveInMyReport('Normal Grid E2E Test Save As');
    });

    it('[TC99177_01] Sort a normal grid', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        // Sort attribute
        await browser.pause(5000);
        await vizPanelForGrid.selectContextMenuOptionFromElement('Category', 'Sort Descending', 'Visualization 1');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Music');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$133,341');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$6,584');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('South');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Music');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$148,872');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$7,631');

        // Sort metric within
        await vizPanelForGrid.selectSortWithinAttribute('metric', 'Cost', 'Sort Within an Attribute', 'Region');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Electronics');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$747,322');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$159,339');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Electronics');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$655,384');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$139,135');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_02] Format a normal grid - Visualization Options', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchToGeneralSettingsTab();

        // Grid Template Color and Style
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss the tooltips
        await newFormatPanelForGrid.clickSectionTitle('Template');
        await newFormatPanelForGrid.selectGridTemplateColor('Blue');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '1', 'Visualization 1')
                        .getCSSProperty('border-bottom-color')
                ).value
            )
            .toContain('28,141,212');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '1', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('255,255,255');

        await newFormatPanelForGrid.selectGridTemplateStyle('classic');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '1', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('28,141,212');

        // Banding and Outline
        await newFormatPanelForGrid.clickSectionTitle('Layout');
        await newFormatPanelForGrid.clickCheckBox('Enable banding');
        await since(
            'The grid cell in visualization "Visualization 1" at "3", "2" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('3', '2', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('249,249,249');

        await newFormatPanelForGrid.clickSectionTitle('Spacing');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('6.93333px 14px');

        await newFormatPanelForGrid.selectCellPadding('small');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('3.06667px 6px');

        await newFormatPanelForGrid.selectCellPadding('large');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "padding" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('padding'))
                    .value
            )
            .toContain('8px 16px');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('width')).value
            )
            .toContain('76.4531px');
        await newFormatPanelForGrid.clickColumnSizeBtn(false);
        await newFormatPanelForGrid.clickColumnSizeFitOption('Fit to Content', false);
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "width" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                parseInt(
                    (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('width'))
                        .value
                ).toString()
            )
            .toContain('24');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_03] Format a normal grid - Text and Forms', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss the tooltips
        await baseFormatPanelReact.switchSection('Text and Form');
        await newFormatPanelForGrid.selectTextFont('Oleo Script');
        await newFormatPanelForGrid.selectFontStyle('bold');
        await newFormatPanelForGrid.setTextFontSize('12');

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('16px');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "2" has style "font-weight" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '2', 'Visualization 1')
                        .getCSSProperty('font-weight')
                ).value.toString()
            )
            .toContain('700');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "4" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '4', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('oleo script');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('16px');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" has style "font-weight" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '2', 'Visualization 1')
                        .getCSSProperty('font-weight')
                ).value.toString()
            )
            .toContain('700');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('oleo script');

        await newFormatPanelForGrid.selectGridSegment('Column Headers');
        await newFormatPanelForGrid.selectFontAlign('center');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('center');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "5" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '5', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('center');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('left');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '5', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('right');

        await newFormatPanelForGrid.selectGridSegment('Row Headers');
        await newFormatPanelForGrid.selectTextFont('Open Sans');
        await newFormatPanelForGrid.setTextFontSize('10');
        await newFormatPanelForGrid.selectVerticalAlign('middle');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '1', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('16px');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "4" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '3', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('oleo script');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('16px');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('oleo script');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('13.3333px');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '2', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('open sans');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('13.3333px');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "2" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '2', 'Visualization 1')
                        .getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('open sans');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "5" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '5', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('center');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('left');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '5', 'Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('right');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "5" has style "vertical-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '5', 'Visualization 1')
                        .getCSSProperty('vertical-align')
                ).value
            )
            .toContain('top');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "vertical-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '1', 'Visualization 1')
                        .getCSSProperty('vertical-align')
                ).value
            )
            .toContain('middle');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "5" has style "vertical-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '5', 'Visualization 1')
                        .getCSSProperty('vertical-align')
                ).value
            )
            .toContain('top');

        await newFormatPanelForGrid.selectGridSegment('Values');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#5C388C');
        await newFormatPanelForGrid.clickFontColorBtn();

        await newFormatPanelForGrid.clickCellFillColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#B3CDEF');
        await newFormatPanelForGrid.clickCellFillColorBtn();

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "4" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('1', '4', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('255,255,255');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '1', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('53,56,58');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridCellByPosition('2', '4', 'Visualization 1').getCSSProperty('color')).value
            )
            .toContain('92,56,140');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "4" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '4', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('28,141,212');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '1', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('255,255,255');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('179,205,239');

        await newFormatPanelForGrid.openCellBorderStyleDropDown();
        await newFormatPanelForGrid.selectCellBorderStyle('dash');
        await newFormatPanelForGrid.clickCellBorderColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#9D9FE0');
        await newFormatPanelForGrid.clickCellBorderColorBtn();

        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '1', 'Visualization 1')
                        .getCSSProperty('border-bottom-color')
                ).value
            )
            .toContain('24,122,184');
        await since(
            'The grid cell in visualization "Visualization 1" at "1", "1" has style "border-bottom-style" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('1', '1', 'Visualization 1')
                        .getCSSProperty('border-bottom-style')
                ).value
            )
            .toContain('solid');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "border-bottom-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '1', 'Visualization 1')
                        .getCSSProperty('border-bottom-color')
                ).value
            )
            .toContain('235,235,235');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "1" has style "border-bottom-style" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '1', 'Visualization 1')
                        .getCSSProperty('border-bottom-style')
                ).value
            )
            .toContain('solid');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" has style "border-bottom-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('border-bottom-color')
                ).value
            )
            .toContain('157,159,224');
        await since(
            'The grid cell in visualization "Visualization 1" at "2", "4" has style "border-bottom-style" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getGridCellByPosition('2', '4', 'Visualization 1')
                        .getCSSProperty('border-bottom-style')
                ).value
            )
            .toContain('dashed');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_04] Format a normal grid - Title and Container', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon(); // to dismiss the tooltips
        await baseFormatPanelReact.switchSection('Title and Container');
        await newFormatPanelForGrid.selectTextFont('Noto Sans');
        await newFormatPanelForGrid.setTextFontSize('20');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#1B1575');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.selectFontAlign('center');

        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#DEDDFF');
        await newFormatPanelForGrid.clickTitleBackgroundColorBtn();
        await baseFormatPanelReact.changeContainerTitleFillColorOpacity('50%');

        await newFormatPanelForGrid.clickContainerFillColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#F4F4F4');
        await newFormatPanelForGrid.clickContainerFillColorBtn();

        await newFormatPanelForGrid.openContainerBorderPullDown();
        await newFormatPanelForGrid.selectBorderStyle('solid-thick');
        await newFormatPanelForGrid.clickContainerBorderColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#000000');
        await newFormatPanelForGrid.clickContainerBorderColorBtn();

        await since(
            'The titlebar in grid "Visualization 1" has style "font-family" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1').getCSSProperty('font-family')
                ).value.toString()
            )
            .toContain('noto sans');
        await since(
            'The titlebar in grid "Visualization 1" has style "font-size" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1').getCSSProperty('font-size'))
                    .value
            )
            .toContain('26.6667px');
        await since(
            'The titlebar in grid "Visualization 1" has style "color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1').getCSSProperty('color')).value
            )
            .toContain('27,21,117');
        await since(
            'The titlebar in grid "Visualization 1" has style "text-align" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getVisualizationTitleBarRoot('Visualization 1').getCSSProperty('text-align'))
                    .value
            )
            .toContain('center');
        await since(
            'The titlebar in grid "Visualization 1" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (
                    await vizPanelForGrid
                        .getContainerTitleBarBackground('Visualization 1')
                        .getCSSProperty('background-color')
                ).value
            )
            .toContain('222,221,255,0.5');
        await since(
            'The grid "Visualization 1" has style "background-color" with value #{expected}, instead it is #{actual}'
        )
            .expect(
                (await vizPanelForGrid.getGridContainer('Visualization 1').getCSSProperty('background-color')).value
            )
            .toContain('244,244,244');
        await since(
            'The grid "Visualization 1" has style "border-style" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Visualization 1').getCSSProperty('border-style')).value)
            .toContain('solid');
        //await since('The grid "Visualization 1" has style "border-top-width" with value #{expected}, instead it is #{actual}')
        //  .expect((await  vizPanelForGrid.getGridContainer("Visualization 1").getCSSProperty("border-top-width")).value)
        //  .toContain('2.5px');
        await since(
            'The grid "Visualization 1" has style "border-color" with value #{expected}, instead it is #{actual}'
        )
            .expect((await vizPanelForGrid.getGridContainer('Visualization 1').getCSSProperty('border-color')).value)
            .toContain('0,0,0');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_05] Duplicate, swap and show data', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseContainer.duplicateContainer('Visualization 1');
        await baseContainer.swapContainer('Visualization 1 copy');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1 copy').getText())
            .toBe('Cost');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1 copy').getText())
            .toBe('Profit');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$77,012');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$21,190');

        await vizPanelForGrid.openShowDataDiagFromViz('Visualization 1 copy');
        await since('An editor should show up with title "Show Data"')
            .expect(await dossierMojo.getMojoEditorWithTitle('Show Data').isDisplayed())
            .toBe(true);

        await since('It should show there are "96" rows of data in the show data dialog')
            .expect(await showDataDialog.getDatasetRowCount())
            .toBe(96);
        await since('Show data grid at row 0 and column 0 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(0, 0).getText())
            .toBe('Category');
        await since('Show data grid at row 1 and column 1 should have element #{expected}, instead we have #{actual}')
            .expect(await showDataDialog.getCellInshowDataGrid(1, 1).getText())
            .toBe('Central');
        await showDataDialog.closeShowDataDialog(true);
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_06] Use grid as filter', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseContainer.selectTargetVisualizations('Visualization 1');
        await baseContainer.clickContainer('Visualization 1 copy');
        await selectTargetInLayersPanel.applyButtonForSelectTarget();

        await vizPanelForGrid.clickOnElement(await vizPanelForGrid.getGridElement('Mid-Atlantic', 'Visualization 1'));
        await browser.pause(2000);
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$67,627');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$18,403');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 7, 'Visualization 1 copy').getText())
            .toBe('2015');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 7, 'Visualization 1 copy').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 7, 'Visualization 1 copy').getText())
            .toBe('Electronics');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 7, 'Visualization 1 copy').getText())
            .toBe('$876,703');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 7 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 7, 'Visualization 1 copy').getText())
            .toBe('$184,700');

        await vizPanelForGrid.clickOnElement(await vizPanelForGrid.getGridElement('$139,659', 'Visualization 1'));
        await browser.pause(2000);
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Movies');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$139,659');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$9,188');

        await vizPanelForGrid.clickOnElement(await vizPanelForGrid.getGridElement('$139,659', 'Visualization 1'));
        await browser.pause(2000);
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1 copy').getText())
            .toBe('Cost');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1 copy').getText())
            .toBe('Profit');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$77,012');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$21,190');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99177_07] Consume in Library consumption mode', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${NormalGridE2ESaveAs.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierPage.resetDossierIfPossible();

        // use grid as filter
        await vizPanelForGrid.clickOnElement(await vizPanelForGrid.getGridElement('Music', 'Visualization 1'));
        await browser.pause(2000);
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Music');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$133,341');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$6,584');

        // Keep only
        await vizPanelForGrid.keepOnly('$235,538', 'Visualization 1 copy', false);
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1 copy').getText())
            .toBe('2014');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1 copy').getText())
            .toBe('Northeast');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1 copy').getText())
            .toBe('Music');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1 copy').getText())
            .toBe('$235,538');
        await since(
            'The grid cell in normal grid "Visualization 1 copy" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1 copy').getText())
            .toBe('$11,429');

        // Sort
        await browser.pause(2000);
        await vizPanelForGrid.sortDescending('Year', 'Visualization 1', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 3, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$121,216');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$33,373');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$107,270');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 4, 'Visualization 1').getText())
            .toBe('$29,540');

        // Show totals
        await vizPanelForGrid.toggleShowTotalsFromMetric('Cost', 'Visualization 1', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$12,609,467');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$1,755,176');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$121,216');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$33,373');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 3, 'Visualization 1').getText())
            .toBe('$1,520,794');

        await vizPanelForGrid.toggleShowTotalsFromAttribute('Category', 'Visualization 1', 'Average', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$12,609,467');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$1,755,176');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$438,794');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$78,388');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 2, 'Visualization 1').getText())
            .toBe('$121,216');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 6, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(6, 3, 'Visualization 1').getText())
            .toBe('$33,373');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 3, 'Visualization 1').getText())
            .toBe('$1,520,794');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 2, 'Visualization 1').getText())
            .toBe('$380,199');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 3, 'Visualization 1').getText())
            .toBe('$68,305');

        // Replace objects
        await vizPanelForGrid.replaceObjectWithinGrid('Region', 'Call Center', 'Visualization 1', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Call Center');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Atlanta');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$29,730,085');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$345,467');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$61,186');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$86,367');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$15,296');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$24,946');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$6,814');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 1, 'Visualization 1').getText())
            .toBe('San Diego');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 3, 'Visualization 1').getText())
            .toBe('$996,850');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 2, 'Visualization 1').getText())
            .toBe('$249,212');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 3, 'Visualization 1').getText())
            .toBe('$44,766');

        await vizPanelForGrid.replaceObjectWithinGrid('Cost', 'Revenue', 'Visualization 1', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 4, 'Visualization 1').getText())
            .toBe('Revenue');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Atlanta');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$35,023,708');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$406,653');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$61,186');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$101,663');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$15,296');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$31,760');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$6,814');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 1, 'Visualization 1').getText())
            .toBe('San Diego');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 3, 'Visualization 1').getText())
            .toBe('$1,175,915');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 2, 'Visualization 1').getText())
            .toBe('$293,979');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 3, 'Visualization 1').getText())
            .toBe('$44,766');

        // Drill
        await vizPanelForGrid.drillFromHeader('Call Center', 'Region', 'Visualization 1', false);
        await since(
            'The grid cell in normal grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Region');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$35,023,708');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$5,293,624');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$2,068,728');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$313,552');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$517,182');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$78,388');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Books');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$154,589');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$33,373');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 9, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(9, 3, 'Visualization 1').getText())
            .toBe('$1,794,014');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 2, 'Visualization 1').getText())
            .toBe('$448,504');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 10, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(10, 3, 'Visualization 1').getText())
            .toBe('$68,305');

        await vizPanelForGrid.drillFromElement('Books', 'Subcategory', 'Visualization 1');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Subcategory');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 1, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 1, 'Visualization 1').getText())
            .toBe('2016');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 2, 'Visualization 1').getText())
            .toBe('Central');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 3, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 4, 'Visualization 1').getText())
            .toBe('$1,121,696');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 2, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(2, 5, 'Visualization 1').getText())
            .toBe('$242,299');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 4, 'Visualization 1').getText())
            .toBe('$154,589');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 3, col 5 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(3, 5, 'Visualization 1').getText())
            .toBe('$33,373');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 2, 'Visualization 1').getText())
            .toBe('$25,765');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 4, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(4, 3, 'Visualization 1').getText())
            .toBe('$5,562');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 1, 'Visualization 1').getText())
            .toBe('Art & Architecture');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 2, 'Visualization 1').getText())
            .toBe('$29,395');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 5, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(5, 3, 'Visualization 1').getText())
            .toBe('$6,821');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 1, 'Visualization 1').getText())
            .toBe('Mid-Atlantic');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 2, 'Visualization 1').getText())
            .toBe('Total');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 11, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(11, 3, 'Visualization 1').getText())
            .toBe('$136,810');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 12, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(12, 1, 'Visualization 1').getText())
            .toBe('Average');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 12, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(12, 2, 'Visualization 1').getText())
            .toBe('$22,802');
        await since(
            'The grid cell in normal grid "Visualization 1" at row 12, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(12, 3, 'Visualization 1').getText())
            .toBe('$4,923');
    });
});
