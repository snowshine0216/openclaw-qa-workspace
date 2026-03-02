import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import * as consts from '../../../constants/visualizations.js';
import NewFormatPanelForGrid from '../../../pageObjects/authoring/format-panel/NewFormatPanelForGrid.js';
import InCanvasSelector_Authoring from '../../../pageObjects/authoring/InCanvasSelector_Authoring.js';
import setWindowSize from '../../../config/setWindowSize.js';
import HtmlContainer_Authoring from '../../../pageObjects/authoring/HtmlContainer_Authoring.js';
import { SelectTargetInLayersPanel } from '../../../pageObjects/authoring/SelectTargetInLayersPanel.js';

const specConfiguration = { ...customCredentials('_sort') };
const { credentials } = specConfiguration;

//npm run regression -- --baseUrl=https://mci-1u056-dev.hypernow.microstrategy.com/MicroStrategyLibrary/ --spec 'specs/regression/dashboardAuthoring/dashboardAuthoringE2E.spec.js'
describe('Dashboard Authoring E2E workflows', () => {
    const tutorialProject = {
        id: 'B628A31F11E7BD953EAE0080EF0583BD',
        name: 'MicroStrategy Tutorial',
    };

    const DashboardAuthoringdE2E = {
        id: '5A791D86334D91B1522377B817F888B8',
        name: 'Dashboard Authoring E2E',
        project: tutorialProject,
    };

    const DashboardAuthoringdE2ESaveAs = {
        id: 'A91CBB3D384596C3AE40C380E5B4B2C9',
        name: 'Dashboard Authoring E2E Save As',
        project: tutorialProject,
    };

    const browserWindow = {
        width: 1600,
        height: 1200,
    };

    let {
        libraryPage,
        libraryAuthoringPage,
        dossierPage,
        baseContainer,
        baseFormatPanel,
        baseFormatPanelReact,
        contentsPanel,
        agGridVisualization,
        dossierAuthoringPage,
        dossierEditorUtility,
        vizPanelForGrid,
        datasetPanel,
        editorPanelForGrid,
        loginPage,
        loadingDialog,
        toc,
        newFormatPanelForGrid,
        textField,
        toolbar,
        viPanelStack,
        viPanelSelector,
        inCanvasSelector_Authoring,
        imageContainer_Authoring,
        htmlContainer_Authoring,
        open_Canvas,
        richTextBox,
        layerPanel,
        freeformPositionAndSize,
        responsiveGroupingEditor,
        shapes,
    } = browsers.pageObj1;

    const selectTargetInLayersPanel = new SelectTargetInLayersPanel();

    beforeAll(async () => {
        await loginPage.login(consts.tqmsUser.credentials);
        await setWindowSize(browserWindow);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99192_00] Dashboard Authoring workflow', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2E.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);
    });

    it('[TC99192_01] Text Field', async () => {
        await dossierAuthoringPage.actionOnToolbar('Text');
        await toolbar.selectOptionFromToolbarPulldown('Text');
        await browser.pause(2000);
        await textField.InputSimpleText("This is Dashboard Authoring & Te'st", 'Text 1');
        await since('I should see the Text Container "Text 1" with content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Text 1')).getText())
            .toBe("This is Dashboard Authoring & Te'st");
        await baseContainer.clickContainer('Visualization 1');

        await dossierAuthoringPage.actionOnToolbar('Text');
        await toolbar.selectOptionFromToolbarPulldown('Text');
        await browser.pause(2000);
        await textField.addDatasetObjectByDragAndDrop('attribute', 'Category', 'New Dataset 1', 'Text 2');
        await textField.addDatasetObjectByDragAndDrop('metric', 'Cost', 'New Dataset 1', 'Text 2');
        await since('I should see the Text Container "Text 2" with content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Text 2')).getText())
            .toBe('Books $29,730,085');

        // Format
        await baseContainer.openContextMenu('Text 1');
        await baseContainer.selectContextMenuOption('Format');
        await newFormatPanelForGrid.selectTextFont('Oleo Script');
        console.log((await (await textField.getTextContainer('Text 1')).getCSSProperty('font-family')).value);
        await since('The "font-family" of textbox "Text 1" should be #{expected}, instead we have #{actual}')
            .expect((await (await textField.getTextContainer('Text 1')).getCSSProperty('font-family')).value)
            .toContain('oleo script');
        await newFormatPanelForGrid.selectFontStyle('bold');
        await since('The "font-weight" of textbox "Text 1" should be #{expected}, instead we have #{actual}')
            .expect((await (await textField.getTextContainer('Text 1')).getCSSProperty('font-weight')).value.toString())
            .toContain('700');
        await textField.ClickFontSizeIncreaseBtnForTimes('2');
        await browser.pause(2000);
        await since('The "font-size" of textbox "Text 1" should be #{expected}, instead we have #{actual}')
            .expect((await (await textField.getTextContainer('Text 1')).getCSSProperty('font-size')).value)
            .toContain('16px');
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');
        await newFormatPanelForGrid.clickFontColorBtn();
        await since('The "color" of textbox "Text 1" should be #{expected}, instead we have #{actual}')
            .expect((await (await textField.getTextContainer('Text 1')).getCSSProperty('color')).value)
            .toContain('193,41,47,1');
        await newFormatPanelForGrid.selectFontAlign('center');
        await since('The "text-align" of textbox "Text 1" should be #{expected}, instead we have #{actual}')
            .expect((await (await textField.getTextContainer('Text 1')).getCSSProperty('text-align')).value)
            .toContain('center');

        await baseContainer.openContextMenu('Text 2');
        await baseContainer.selectContextMenuOption('Edit');
        await since('I should see the Text Container "Text 2" with content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Text 2')).getText())
            .toBe('{Category} {Cost}');
        await textField.changeNumberFormat('Currency');
        await since('I should see the Text Container "Text 2" with content as #{expected}, instead we have #{actual}')
            .expect(await (await textField.getTextContainer('Text 2')).getText())
            .toBe('Books $29,730,084.52');

        await dossierAuthoringPage.actionOnMenubarWithSubmenu('File', 'Save As...');
        await browser.pause(3000);
        await libraryAuthoringPage.saveInMyReport('Dashboard Authoring E2E Save As');
        await browser.pause(2000);
    });

    it('[TC99192_02] Image Container', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await dossierAuthoringPage.actionOnToolbar('Image');
        await since(
            'I should see the Image Container "Image 1" with URL as "", should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await imageContainer_Authoring.getImageContainerWithURL('Image 1', '')).isExisting())
            .toBe(true);

        await imageContainer_Authoring.editURL(
            'Image 1',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MicroStrategy_logo.svg/1280px-MicroStrategy_logo.svg.png'
        );
        await since(
            'I should see the Image Container "Image 1" with URL as "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MicroStrategy_logo.svg/1280px-MicroStrategy_logo.svg.png", should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await (
                    await imageContainer_Authoring.getImageContainerWithURL(
                        'Image 1',
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MicroStrategy_logo.svg/1280px-MicroStrategy_logo.svg.png'
                    )
                ).isExisting()
            )
            .toBe(true);

        await baseContainer.deleteContainer('Image 1');
        await since('I should see the Image Container "Image 1", should be #{expected}, instead we have #{actual}')
            .expect(await (await imageContainer_Authoring.getImageContainer('Image 1')).isExisting())
            .toBe(false);

        await toolbar.clickButtonFromToolbar('Undo');
        await since(
            'I should see the Image Container "Image 1" with URL as "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MicroStrategy_logo.svg/1280px-MicroStrategy_logo.svg.png", should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await (
                    await imageContainer_Authoring.getImageContainerWithURL(
                        'Image 1',
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/MicroStrategy_logo.svg/1280px-MicroStrategy_logo.svg.png'
                    )
                ).isExisting()
            )
            .toBe(true);

        await baseContainer.openContextMenu();
        await baseContainer.selectContextMenuOption('Edit');
        await imageContainer_Authoring.editURL(
            'Image 1',
            'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png'
        );
        await since(
            'I should see the Image Container "Image 1" with URL as "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png", should be #{expected}, instead we have #{actual}'
        )
            .expect(
                await (
                    await imageContainer_Authoring.getImageContainerWithURL(
                        'Image 1',
                        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png'
                    )
                ).isExisting()
            )
            .toBe(true);

        await baseContainer.clickContainer('Image 1');
        await baseFormatPanelReact.switchSection('Image');
        await baseFormatPanelReact.changeDropdownReact('Fit to Container', 'Fixed to');
        await since(
            'The checkbox for "Lock aspect ratio" should be #{expected} in the format panel, instead we have #{actual}'
        )
            .expect(
                await (await baseFormatPanelReact.getCheckboxWithLabelReact('Lock aspect ratio')).getAttribute('class')
            )
            .toContain('checked');

        await baseFormatPanelReact.clickOnCheckboxReact('Lock aspect ratio');
        await since(
            'The checkbox for "Lock aspect ratio" should be #{expected} in the format panel, instead we have #{actual}'
        )
            .expect(
                await (await baseFormatPanelReact.getCheckboxWithLabelReact('Lock aspect ratio')).getAttribute('class')
            )
            .not.toContain('checked');

        await imageContainer_Authoring.setXAndY('100', '100');
        await since('I should see the Image Container "Image 1" with width as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('width')
                ).value
            )
            .toContain('100px');
        await since('I should see the Image Container "Image 1" with height as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('height')
                ).value
            )
            .toContain('100px');

        await imageContainer_Authoring.restoreToOriginalSizeByFormatPanel();
        await since('I should see the Image Container "Image 1" with width as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('width')
                ).value
            )
            .toContain('475px');
        await since('I should see the Image Container "Image 1" with height as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('height')
                ).value
            )
            .toContain('475px');

        await baseFormatPanelReact.changeDropdownReact('Fixed to', 'Fit to Container');
        await since('I should see the Image Container "Image 1" with width as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('width')
                ).value
            )
            .toContain('76px');
        await since('I should see the Image Container "Image 1" with height as #{expected}, instead we have #{actual}')
            .expect(
                (
                    await (await imageContainer_Authoring.getImageContainer('Image 1'))
                        .$(`./descendant::img/..`)
                        .getCSSProperty('height')
                ).value
            )
            .toContain('76px');

        await baseFormatPanelReact.switchSection('Title and Container');
        await baseFormatPanelReact.changeContainerFillColor({ color: 'No Fill' });
        console.log(await (await baseContainer.getContainer('Image 1').getCSSProperty('background-color')).value);
        await since(`The container's fill color should be #{expected}, instead we have #{actual}`)
            .expect(await (await baseContainer.getContainer('Image 1').getCSSProperty('background-color')).value)
            .toBe('rgba(0,0,0,0)');
        await baseFormatPanelReact.changeContainerFillColor( { color: '#C1292F'});
        await baseFormatPanelReact.dismissColorPicker();
        console.log(await (await baseContainer.getContainer('Image 1').getCSSProperty('background-color')).value);
        await since(`The container's fill color should be #{expected}, instead we have #{actual}`)
            .expect(await (await baseContainer.getContainer('Image 1').getCSSProperty('background-color')).value)
            .toBe('rgba(193,41,47,1)');

        await baseFormatPanelReact.changeContainerBorder('1 point dashed');
        await since(`The container's outer border type should be #{expected}, instead we have #{actual}`)
            .expect(await (await baseContainer.getContainer('Image 1').getCSSProperty('border-bottom-style')).value)
            .toBe('dashed');
        await since(`The container's outer border width should be #{expected}, instead we have #{actual}`)
            .expect(await (await baseContainer.getContainer('Image 1').getCSSProperty('border-bottom-width')).value)
            .toBe('1px');

        await libraryAuthoringPage.simpleSaveDashboard();
    });
    
    it('[TC99192_03] HTML Container', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await dossierAuthoringPage.actionOnToolbar('HTML Container');
        // iFrame doesn't work in Tanzu
        await htmlContainer_Authoring.switchToIFrameByEdit('http://www.bing.com');

        await htmlContainer_Authoring.switchToIFrameByEdit();
        console.log(await htmlContainer_Authoring.textInputArea.getValue());
        await since('The iFrame content of HTML Container should be #{expected}, instead we have #{actual}')
            .expect(await htmlContainer_Authoring.textInputArea.getValue())
            .toBe('http://www.bing.com');

        await htmlContainer_Authoring.clickHtmlContainerOkButton();
        await htmlContainer_Authoring.switchToIFrameByFormatPanel();
        await since(
            'The iFrame content of HTML Container should be #{expected} in Format Panel, instead we have #{actual}'
        )
            .expect(await htmlContainer_Authoring.formatPanelTextInputArea.getValue())
            .toBe('http://www.bing.com');

        await htmlContainer_Authoring.switchToHtmlTextByEdit('<h1>Heading 1</h1>');
        await htmlContainer_Authoring.switchToHtmlTextByEdit();
        console.log(await (await htmlContainer_Authoring.textInputArea).getValue());
        await since('The HTML Text content of HTML Container should be #{expected}, instead we have #{actual}')
            .expect(await (await htmlContainer_Authoring.textInputArea).getValue())
            .toBe('<h1>Heading 1</h1>');
        await htmlContainer_Authoring.clickHtmlContainerOkButton();
        await htmlContainer_Authoring.switchToHtmlTextByFormatPanel();
        console.log(await htmlContainer_Authoring.formatPanelTextInputArea.getValue());
        await since(
            'The HTML Text content of HTML Container should be #{expected} in Format Panel, instead we have #{actual}'
        )
            .expect(await htmlContainer_Authoring.formatPanelTextInputArea.getValue())
            .toBe('<h1>Heading 1</h1>');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99192_04] Panel Stack', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await vizPanelForGrid.deleteViz('Visualization 1');
        await dossierAuthoringPage.actionOnToolbar('Panel Stack');
        await toolbar.selectOptionFromToolbarPulldown('Panel Stack');
        await browser.pause(1000);
        await since(
            'Panel stack "Panel Stack 1" is inserted on canvas, should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await viPanelStack.getPanelStack('Panel Stack 1')).isDisplayed())
            .toBe(true);
        await since('The tabs for panel stack "Panel Stack 1" should be #{expected}, instead we have #{actual}')
            .expect(await viPanelStack.getPanelTabStrip('Panel Stack 1').getAttribute('class'))
            .toContain('alignTop');

        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', false);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Profit', 'metric', 'New Dataset 1');
        await browser.pause(2000);
        await since(
            'The editor panel has the items "Year" in the "Rows" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Year', 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel has the items "Category" in the "Rows" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Category', 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel should have the items "Cost" in the "Columns" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Cost', 'Columns').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel should have the items "Profit" in the "Columns" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Profit', 'Columns').isDisplayed())
            .toBe(true);

        await viPanelStack.addPanel('Panel Stack 1');
        await browser.pause(1000);
        await since('There number of panels in "Panel Stack 1" should be #{expected}, instead we have #{actual}')
            .expect(await viPanelStack.getPanelCount('Panel Stack 1'))
            .toBe(2);
        await since(
            'The selected panel in panel stack "Panel Stack 1" should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await viPanelStack.getCurrentPanelInPanelStack('Panel Stack 1')).getText())
            .toBe('Panel 2');

        await baseContainer.changeViz('Compound Grid', '', false);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Region', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'New Dataset 1');
        await browser.pause(2000);
        await since(
            'The editor panel has the items "Year" in the "Rows" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Year', 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel has the items "Region" in the "Rows" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Region', 'Rows').isDisplayed())
            .toBe(true);
        await since(
            'The editor panel should have the items "Revenue" in the "Column Set 1" zone, should be #{expected}, instead we have #{actual}'
        )
            .expect(await editorPanelForGrid.getObjectFromSectionSansType('Revenue', 'Column Set 1').isDisplayed())
            .toBe(true);

        await baseContainer.clickContainerByScript('Text 1');
        await dossierAuthoringPage.actionOnToolbar('Filter');
        await toolbar.selectOptionFromToolbarPulldown('Panel Selector');
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Panel Stack 1', 'Panel Selector 1');
        await since(
            'The selected panel in panel stack "Panel Stack 1" should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await viPanelStack.getCurrentPanelInPanelStack('Panel Stack 1')).getText())
            .toBe('Panel 2');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Region');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Revenue');

        await viPanelSelector.linkBarPanelSelector('Panel Selector 1', 'Panel 1');
        await since(
            'The selected panel in panel stack "Panel Stack 1" should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await viPanelStack.getCurrentPanelInPanelStack('Panel Stack 1')).getText())
            .toBe('Panel 1');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 1, 'Visualization 1'))
            .toBe('Year');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 2, 'Visualization 1'))
            .toBe('Category');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 3, 'Visualization 1'))
            .toBe('Cost');
        await since(
            'The grid cell in ag-grid "Visualization 1" at row 1, col 4 should be #{expected}, instead it is #{actual}'
        )
            .expect(await agGridVisualization.getGridCellTextByPosition(1, 4, 'Visualization 1'))
            .toBe('Profit');

        await viPanelSelector.linkBarPanelSelector('Panel Selector 1', 'Panel 2');
        await since(
            'The selected panel in panel stack "Panel Stack 1" should be #{expected}, instead we have #{actual}'
        )
            .expect(await (await viPanelStack.getCurrentPanelInPanelStack('Panel Stack 1')).getText())
            .toBe('Panel 2');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 1 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 1, 'Visualization 1').getText())
            .toBe('Year');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 2 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 2, 'Visualization 1').getText())
            .toBe('Region');
        await since(
            'The grid cell in compound grid "Visualization 1" at row 1, col 3 should be #{expected}, instead it is #{actual}'
        )
            .expect(await vizPanelForGrid.getGridCellByPosition(1, 3, 'Visualization 1').getText())
            .toBe('Revenue');

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99192_05] Reposition containers', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());

        await baseContainer.moveContainerByPosition('Panel Selector 1', 'Text 1', 'Bottom');
        //await baseContainer.moveContainerByPosition("Image 1", "Text 1", "Bottom");
        await baseContainer.moveContainerByPosition('Image 1', 'HTML Container 1', 'Right');
        await baseContainer.moveContainerByPosition('Text 1', 'Text 2', 'Left');

        await since(
            'Container "Text 1" is on the "left" side of container "Text 2", should be #{expected}, instead we have #{actual}'
        )
            .expect((await baseContainer.containerRelativePosition('Text 1', 'Text 2', 'left')).toString())
            .toBe('-12');

        await since(
            'Container "Panel Selector 1" is on the "bottom" side of container "Text 1", should be #{expected}, instead we have #{actual}'
        )
            .expect((await baseContainer.containerRelativePosition('Panel Selector 1', 'Text 1', 'bottom')).toString())
            .toBe('-96');

        await since(
            'Container "HTML Container 1" is on the "left" side of container "Image 1", should be #{expected}, instead we have #{actual}'
        )
            .expect((await baseContainer.containerRelativePosition('HTML Container 1', 'Image 1', 'left')).toString())
            .toBe('-12');

        await libraryAuthoringPage.simpleSaveDashboard();
    });
    
    it('[TC99192_06] Freeform Layout + Position/Size + Grouping + Align + Shape', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await dossierAuthoringPage.actionOnToolbar("Add Chapter");  
        // switch to freeform layout  
        // Insert rich text boxes and adjust sizes/positions
        await open_Canvas.clickOnOpenCanvasButton();
        await dossierAuthoringPage.actionOnToolbar("Text");    
        await toolbar.selectOptionFromToolbarPulldown("Rich Text");
        await richTextBox.InputPlainText("Hello World & Te'st", 'Rich Text 1');
        await since('I should see the Rich textbox "Rich Text 1" with content as #{expected}, instead we have #{actual}')
            .expect(await (await richTextBox.getRichTextField('Rich Text 1')).getText())
            .toBe("Hello World & Te'st");

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(5);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(2);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(8);

        // Insert a viz and adjust sizes/positions
        await baseContainer.clickContainer('Visualization 1');
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(5);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(12);
        await freeformPositionAndSize.ReplaceWidthInputBoxInReactPanel(40);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(50);

        await baseContainer.changeViz('Grid (Modern)', 'Visualization 1', false);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Profit', 'metric', 'New Dataset 1');
        
        // Move inserting another rich text box after creating the modern grid, to make sure the dataset panel is open
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await dossierAuthoringPage.actionOnToolbar('Text');
        await toolbar.selectOptionFromToolbarPulldown('Rich Text');
        await browser.pause(2000);
        await textField.addDatasetObjectByDragAndDrop('metric', 'Cost', 'New Dataset 1', 'Rich Text 2');
        await textField.addDatasetObjectByDragAndDrop('attribute', 'Category', 'New Dataset 1', 'Rich Text 2');
        await since('I should see the Rich textbox "Rich Text 2" with content as #{expected}, instead we have #{actual}')
            .expect(await (await richTextBox.getRichTextField('Rich Text 2')).getText())
            .toBe('Books $29,730,085 ');
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(50);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(2);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(8);

        // Insert a shape and adjust fill color/border color/sizes/positions
        await dossierAuthoringPage.actionOnToolbar('Shape');
        await toolbar.selectOptionFromToolbarPulldown('Rectangle');
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.changeContainerFillColor( { color: '#55BFC3'});
        await baseFormatPanelReact.dismissColorPicker();
        await shapes.selectShapeBorderColorButton();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#7E0F16');
        await shapes.selectShapeBorderColorButton();
        await shapes.ClickOnRadioButton('Medium radius');
        await freeformPositionAndSize.ReplaceWidthInputBoxInReactPanel(44);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(54);
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(20);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(30);

        // container manipulations: Send to Back, Group, Alignment
        await baseContainer.openContextMenu('Rectangle');
        await baseContainer.selectContextMenuOption('Send to Back');
        await layerPanel.groupContainers('Rectangle,Visualization 1');
        
        await open_Canvas.openAndTakeContextMenuByRMCTitle("Visualization 1", "Align Left");
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_01',
           'Dashboard Authoring E2E freeform layout_Align Left',
           {tolerance: 0.1 }
        );
        await open_Canvas.openAndTakeContextMenuByRMCTitle("Visualization 1", "Align Center");
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_02',
           'Dashboard Authoring E2E freeform layout_Align Center',
           {tolerance: 0.1 }
        );

        await open_Canvas.openAndTakeContextMenuByRMCTitle("Visualization 1", "Align Top");
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_03',
           'Dashboard Authoring E2E freeform layout_Align Top',
           {tolerance: 0.1 }
        );

        await open_Canvas.openAndTakeContextMenuByRMCTitle("Visualization 1", "Align Middle");
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_04',
           'Dashboard Authoring E2E freeform layout_Align Middle',
           {tolerance: 0.1 }
        );

        // Insert a panel stack and corresponding panel selector, and adjust sizes/positions
        await dossierAuthoringPage.actionOnToolbar('Panel Stack');
        await toolbar.selectOptionFromToolbarPulldown('Panel Stack');
        await browser.pause(1000);

        await baseContainer.changeViz('Grid (Modern)', '', false);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Category', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Cost', 'metric', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Profit', 'metric', 'New Dataset 1');
        await browser.pause(2000);

        await viPanelStack.addPanel('Panel Stack 1');
        await browser.pause(1000);
        await baseContainer.changeViz('Compound Grid', '', false);
        await datasetPanel.addObjectToVizByDoubleClick('Year', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Region', 'attribute', 'New Dataset 1');
        await datasetPanel.addObjectToVizByDoubleClick('Revenue', 'metric', 'New Dataset 1');
        await browser.pause(2000);

        await baseContainer.clickContainerByScript('Rich Text 1');
        await dossierAuthoringPage.actionOnToolbar('Filter');
        await toolbar.selectOptionFromToolbarPulldown('Panel Selector');
        await viPanelSelector.selectTargetPanelStackFromLayersPanel('Panel Stack 1', 'Panel Selector 1');

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(50);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(12);
        await freeformPositionAndSize.ReplaceWidthInputBoxInReactPanel(50);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(5);

        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(50);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(18);
        await freeformPositionAndSize.ReplaceWidthInputBoxInReactPanel(50);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(50);

        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_05',
           'Dashboard Authoring E2E freeform layout',
           {tolerance: 0.1 }
        );

    });

    it('[TC99192_07] Rich Text Box Partial Formatting', async () => { 
        await layerPanel.clickOnContainerFromLayersPanel("Rich Text 1");
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Textbox Options");
        await richTextBox.DoubleClickRichTextbox("Rich Text 1");

        await richTextBox.pressShiftAndArrowKeyToHighlightText("right", 11);
        await textField.ClickOnFontStyleButtonInPanel("bold");
        await textField.replaceFontSizeText(16);
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Textbox Options");
        await richTextBox.DoubleClickRichTextbox("Rich Text 1");
        await richTextBox.pressArrowKeyToMoveCursor("right", 14);
        await richTextBox.pressShiftAndArrowKeyToHighlightText("right", 5);
        await textField.replaceFontSizeText(12);
        await newFormatPanelForGrid.clickFontColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#C1292F');
        await newFormatPanelForGrid.clickFontColorBtn();
        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await newFormatPanelForGrid.clickContainerFillColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#DDCAFF');
        await newFormatPanelForGrid.clickContainerFillColorBtn();
        await newFormatPanelForGrid.openContainerBorderPullDown();
        await newFormatPanelForGrid.selectBorderStyle('solid-thick');
        await newFormatPanelForGrid.clickContainerBorderColorBtn();
        await newFormatPanelForGrid.clickColorPickerModeBtn('grid');
        await newFormatPanelForGrid.clickBuiltInColor('#4F60D6');
        await newFormatPanelForGrid.clickContainerBorderColorBtn();

        // Copy/Paste formatting
        await baseContainer.openContextMenu('Rich Text 1');
        await baseContainer.selectContextMenuOption('Copy Formatting');
        await baseContainer.openContextMenu('Rich Text 2');
        await baseContainer.selectContextMenuOption('Paste Formatting');
        await baseContainer.openContextMenu('Panel Selector');
        await baseContainer.selectContextMenuOption('Paste Formatting');

        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
           'TC99192_06',
           'Dashboard Authoring E2E freeform layout after partial formatting rich text',
           {tolerance: 0.1 }
        );

        await libraryAuthoringPage.simpleSaveDashboard();
    });
    
    it('[TC99192_08] Layers Panel', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        // select target
        await baseContainer.selectTargetVisualizations('Visualization 1');
        await layerPanel.multiSelectContainers('Panel Stack 1');
        await selectTargetInLayersPanel.applyButtonForSelectTarget();
        await dossierAuthoringPage.clickOnElement(await agGridVisualization.getGridCell('2015', 'Visualization 1'));
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_07',
            'Dashboard Authoring E2E freeform layout after grid as filtering manipulation',
            {tolerance: 0.1 }
        );

        // Hide on Default View
        await layerPanel.rightClickOnContainerFromLayersPanel("Rich Text 1"); 
        await layerPanel.contextMenuActionFromLayersPanel("Hide on Default View");

        // Hide on Responsive View
        await layerPanel.rightClickOnContainerFromLayersPanel("Rich Text 2"); 
        await layerPanel.contextMenuActionFromLayersPanel("Hide on Responsive View");

        // select target
        await layerPanel.rightClickOnContainerFromLayersPanel('Visualization 1');
        await layerPanel.contextMenuActionFromLayersPanel("Duplicate");

        await baseFormatPanel.switchToFormatPanelByClickingOnIcon();
        await baseFormatPanelReact.switchSection("Title and Container");
        await freeformPositionAndSize.ReplaceXInputBoxInReactPanel(30);
        await freeformPositionAndSize.ReplaceYInputBoxInReactPanel(70);
        await freeformPositionAndSize.ReplaceWidthInputBoxInReactPanel(40);
        await freeformPositionAndSize.ReplaceHeightInputBoxInReactPanel(30);
        await dossierAuthoringPage.clickOnElement(await agGridVisualization.getGridCell('$681,179', 'Visualization 1 copy'));
        await loadingDialog.waitLoadingDataPopUpIsNotDisplayed();

        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_08',
            'Dashboard Authoring E2E freeform layout after layers panel manipulation and filtering by using the copy',
            {tolerance: 0.1 }
        );

        await viPanelStack.switchPanel('Panel 1', 'Panel Stack 1');
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_09',
            'Dashboard Authoring E2E freeform layout after layers panel manipulation, filtering by using the copy and switching panel',
            {tolerance: 0.1 }
        );

        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99192_09] Responsive View', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}/edit`;
        await libraryPage.openDossierByUrl(url.toString());
        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_10',
            'Dashboard Authoring E2E freeform layout in responsive mode',
            {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_11',
            'Dashboard Authoring E2E auto layout in responsive mode',
            {tolerance: 0.1 }
        );
        
        await toolbar.clickButtonFromToolbar('Full View');
        await toolbar.clickButtonFromToolbar('Responsive View Editor');
        await responsiveGroupingEditor.groupContainers('HTML Container 1,Image 1');
        await responsiveGroupingEditor.groupContainers('Text 1,Text 2');
        await responsiveGroupingEditor.clickSaveCancelBotton('Save');
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_12',
            'Dashboard Authoring E2E auto layout after grouping in responsive mode',
            {tolerance: 0.1 }
        );
        await toolbar.clickButtonFromToolbar('Full View');
        await toolbar.clickButtonFromToolbar('Responsive View Editor');
        await responsiveGroupingEditor.deleteGroupFromToolbar('Group 1');
        await responsiveGroupingEditor.clickSaveCancelBotton('Save');
        await toolbar.clickButtonFromToolbar('Responsive Preview');
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_13',
            'Dashboard Authoring E2E auto layout after deleting group 1 in responsive mode',
            {tolerance: 0.1 }
        );

        await toolbar.clickButtonFromToolbar('Full View');
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_14',
            'Dashboard Authoring E2E auto layout after deleting grouping in full view',
            {tolerance: 0.1 }
        );

        await contentsPanel.goToPage({ chapterName: 'Chapter 2', pageName: 'Page 1' });
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierEditorUtility.getRootViewContent(),
            'TC99192_15',
            'Dashboard Authoring E2E double check freeform layout in full view',
            {tolerance: 0.1 }
        );
        await libraryAuthoringPage.simpleSaveDashboard();
    });

    it('[TC99192_10] Dashboard Authoring - Library Consumption', async () => {
        const url = browser.options.baseUrl + `app/${tutorialProject.id}/${DashboardAuthoringdE2ESaveAs.id}`;
        await libraryPage.openDossierByUrl(url.toString());
        await browser.pause(2000);
        await dossierPage.resetDossierIfPossible();
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99192_16',
            'Dashboard Authoring E2E free layout in consumption mode',
            {tolerance: 0.1 }
        );

        // Use grids to filter the panel stack
        await dossierAuthoringPage.clickOnElement(await agGridVisualization.getGridCell('2014', 'Visualization 1'));
        await browser.pause(2000);
        await dossierAuthoringPage.clickOnElement(await agGridVisualization.getGridCell('$949,950', 'Visualization 1 copy'));
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99192_17',
            'Dashboard Authoring E2E free layout after filtering in consumption mode',
            {tolerance: 0.1 }
        );
        await viPanelSelector.linkBarPanelSelector('Panel Selector 1', 'Panel 2');
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99192_18',
            'Dashboard Authoring E2E free layout after filtering and switching to Panel 2 in consumption mode',
            {tolerance: 0.1 }
        );

        await toc.openPageFromTocMenu({ chapterName: 'Chapter 1', pageName: 'Page 1' });
        await browser.pause(2000);
        await takeScreenshotByElement(
            dossierPage.getDossierView(),
            'TC99192_19',
            'Dashboard Authoring E2E auto layout in consumption mode',
            {tolerance: 0.1 }
        );
        await viPanelSelector.linkBarPanelSelector('Panel Selector 1', 'Panel 1');
        await takeScreenshotByElement(
             dossierPage.getDossierView(),
            'TC99192_20',
            'Dashboard Authoring E2E auto layout after switching to Panel 1 in consumption mode',
            {tolerance: 0.1 }
        );

    });


});
