import { takeScreenshotByElement } from '../../../utils/TakeScreenshot.js';
import { customCredentials } from '../../../constants/index.js';
import resetDossierState from '../../../api/resetDossierState.js';
import InCanvasSelector from '../../../pageObjects/selector/InCanvasSelector.js';
import setWindowSize from '../../../config/setWindowSize.js';

const specConfiguration = { ...customCredentials('_authoring') };

describe('Selector Panel Authoring', () => {
    const authoringDossier = {
        id: 'A782F8424EE95FD24AB1A49728FDFDE8',
        name: '(Auto) Selector Panel Authoring',
        project: {
            id: '9D8A49D54E04E0BE62C877ACC18A5A0A',
            name: 'MicroStrategy Tutorial',
        },
    };

    let {
        libraryAuthoringPage,
        libraryPage,
        dossierPage,
        dossierAuthoringPage,
        loginPage,
        layerPanel,
        inCanvasSelector_Authoring,
        contentsPanel,
        viPanelStack,
        toolbar,
        grid,
        newFormatPanelForGrid,
        formatPanel,
        textField,
        gridAuthoring,
    } = browsers.pageObj1;

    beforeAll(async () => {
        await setWindowSize({
            width: 1600,
            height: 1200,
        });
        await loginPage.login(specConfiguration.credentials);
    });

    afterEach(async () => {
        await dossierPage.goToLibrary();
    });

    it('[TC99644_01] Validate functionality of Selector Panel in authoring - Create Selector Panel', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Create Selector Panel' });
        await toolbar.createSelectorPanel();
        await takeScreenshotByElement(
            viPanelStack.getGhostImageContainerByIndex(0),
            'TC99644_01',
            'Selector Panel - No Filter'
        );
        await layerPanel.clickOnContainerFromLayersPanel('Selector Panel 1');
        await since('When SP Selected, Visualization button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Visualization'))
            .toBe(true);
        await since('When SP Selected, Panel Stack button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Panel stacks'))
            .toBe(true);
        await since('When SP Selected, IW button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Information'))
            .toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Filter');
        await since('Panel selector disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isOptionDisabledInMenu('Panel Selector'))
            .toBe(true);
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Element / Value Filter');
        await inCanvasSelector_Authoring.dragDSObjectToSelector('attribute', 'Category', 'New Dataset 1', 0, false);
        await inCanvasSelector_Authoring.selectTargetVizFromWithinSelector('Visualization 1', 'Category');
        const CategorySelector = InCanvasSelector.createByAriaLable('Category');
        await CategorySelector.selectItem('Books');
        await since('Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneColumnData('Visualization 1', 'Category'))
            .toEqual(['Electronics', 'Movies', 'Music']);
    });

    it('[TC99644_02] Validate functionality of Selector Panel in authoring - Create selector window', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await dossierPage.waitForDossierLoading();
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Create Selector Window' });

        // create selector window
        await toolbar.createSelectorWindow();
        await since('When SP Selected, Visualization button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Visualization'))
            .toBe(true);
        await since('When SP Selected, Panel Stack button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Panel stacks'))
            .toBe(true);
        await since('When SP Selected, IW button disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isBtnDisabled('Information'))
            .toBe(true);
        await dossierAuthoringPage.actionOnToolbar('Filter');
        await since('Panel selector disabled should be #{expected}, instead we have #{actual}')
            .expect(await dossierAuthoringPage.isOptionDisabledInMenu('Panel Selector'))
            .toBe(true);
        await dossierAuthoringPage.actionOnSubmenuNoContinue('Parameter Selector');
        await dossierAuthoringPage.addParameterToParameterSelector('Object Parameter', 1);
        await layerPanel.clickOnContainerFromLayersPanel('Selector Window 1');
        await newFormatPanelForGrid.switchToTab('selector-window');
        await formatPanel.clickAutoLayout();
        await layerPanel.clickOnContainerFromLayersPanel('Text 3');
        await textField.openContextMenu();
        await textField.selectContextMenuOption('Select Information Window');
        await textField.selectSecondaryContextMenuOption('Selector Window 1');

        // no selector window
        await layerPanel.clickOnContainerFromLayersPanel('Visualization 1');
        await gridAuthoring.openContextMenu('Visualization 1');
        await since('Selector window option for grid exist should be #{expected}, instead we have #{actual}')
            .expect(await grid.isContextMenuOptionPresent({ level: 0, option: 'Select Information Window' }))
            .toBe(false);

        // change selection
        await dossierPage.clickTextfieldByTitle('Selector Window');
        const CategorySelector = InCanvasSelector.createByTitle('Object Parameter');
        await CategorySelector.selectItem('Category HTML');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Grid should be #{expected}, instead we have #{actual}')
            .expect(await grid.getOneRowData('Visualization 1', 1))
            .toEqual(['Category HTML', 'Profit']);
    });

    it('[TC99644_03] Validate functionality of Selector Panel in authoring - Select Target', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Select Target' });
        await layerPanel.expandORCollapseGroup('Information Window 1', 'Expand');
        await layerPanel.expandORCollapseGroup('Window Panel 1', 'Expand');
        await layerPanel.expandORCollapseGroup('Panel Stack 1', 'Expand');
        await layerPanel.expandORCollapseGroup('Panel 1', 'Expand');
        await layerPanel.expandORCollapseGroup('Selector Panel 2', 'Expand');
        await layerPanel.clickOnContainerFromLayersPanel('Selector Panel 1');
        // await viPanelStack.hoverOnButton('kKC78F4C41493016C2209D438E2F0525F6', 'Apply');
        // await since('When Apply button is hovered, Tooltip should be #{expected}, instead we have #{actual}')
        //     .expect(await dossierAuthoringPage.mojoTooltip())
        //     .toBe(
        //         `The Apply button is disabled in authoring mode. In consumption mode, click 'Apply' to confirm filter and selector choices.`
        //     );
        await inCanvasSelector_Authoring.clickSelectTargetButton('Year');
        await takeScreenshotByElement(formatPanel.dossierEditorUtility.getVIVizPanel(), 'TC99644_03', 'Select Target');
        await takeScreenshotByElement(layerPanel.getLayersPanel(), 'TC99644_03', 'Layers Panel');
        // check select target
        await inCanvasSelector_Authoring.selectTargets('Quarter', 'Visualization1');
        await layerPanel.clickOnContainerFromLayersPanel('Panel Stack 1');
        await inCanvasSelector_Authoring.clickApplyButtonFromFilterBoxDialog();
        const yearICS = InCanvasSelector.createByTitle('Year');
        await yearICS.selectItem('2014');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        const quarterICS = InCanvasSelector.createByTitle('Quarter');
        await since('Selected Item for Quarter should be #{expected}, instead we have #{actual}')
            .expect(await quarterICS.getSelectedDrodownItem())
            .toBe('2015 Q1');
        const monthICS = InCanvasSelector.createByTitle('Month');
        await since('Selected Item for Month should be #{expected}, instead we have #{actual}')
            .expect(await monthICS.getSelectedItemsText())
            .toEqual(['Jan 2015']);
        await since('Uncheck 2014, grid data  for YearGrid should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneColumnData('YearGrid', 'Year'))
            .toEqual(['2015']);
        await since('Uncheck 2014, grid data for Visualization1 should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneColumnData('Visualization1', 'Year'))
            .toEqual(['2015']);
    });

    it('[TC99644_04] Validate functionality of Selector Panel in authoring - context menu', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Context Menu' });
        await layerPanel.expandORCollapseGroup('Selector Panel 1', 'Expand');
        // Copy/Paste Formatting for button
        await layerPanel.rightClickOnContainerFromLayersPanel('Apply Button', false);
        await since('Context menu option for button should be #{expected}, instead we have #{actual}')
            .expect(await layerPanel.getContextMenuOptionsList())
            .toEqual(['Format', 'Copy Formatting', 'Paste Formatting']);
        await layerPanel.contextMenuActionFromLayersPanel('Copy Formatting');

        await layerPanel.rightClickOnContainerFromLayersPanel('Cancel Button', false);
        await layerPanel.contextMenuActionFromLayersPanel('Paste Formatting');
        await since('When paste formatting,button background color should be #{expected}, instead we have #{actual}')
            .expect(await viPanelStack.buttonStyle('kWEFEF897A27474BCBA051BFE6BE16DCFA', 'Apply', 'background-color'))
            .toBe('rgba(56,174,111,1)');

        // Duplicate for selector panel
        await layerPanel.rightClickOnContainerFromLayersPanel('Selector Panel 1', false);
        await since('Context menu option for selector panel should be #{expected}, instead we have #{actual}')
            .expect(await layerPanel.getContextMenuOptionsList())
            .toEqual(['Duplicate', 'Format', 'Copy Formatting', 'Paste Formatting', 'Delete']);
        await layerPanel.contextMenuActionFromLayersPanel('Duplicate');
        await takeScreenshotByElement(formatPanel.dossierEditorUtility.getVIVizPanel(), 'TC99644_04', 'Duplicate');
    });

    it('[TC99644_05] Validate functionality of Selector Panel in authoring - Format Panel', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Format Panel' });
        await layerPanel.expandORCollapseGroup('Selector Panel 1', 'Expand');
        await layerPanel.clickOnContainerFromLayersPanel('Apply Button');
        await since('Switch to Apply button, Format title should be #{expected}, instead we have #{actual}')
            .expect(await formatPanel.formatTitle())
            .toBe('Apply Button');
        await layerPanel.clickOnContainerFromLayersPanel('Selector Panel 1');
        await since('Switch to Selector Panel 1, Format title should be #{expected}, instead we have #{actual}')
            .expect(await formatPanel.formatTitle())
            .toBe('Selector Panel 1');
        await formatPanel.setFontColor(23); // Royal blue
        await formatPanel.setRadiusValue(30);
        await formatPanel.setPanelStackPaddingValue(30);
        await since('Selector Panel Padding should be #{expected}, instead we have #{actual}')
            .expect(await viPanelStack.getPanelPadding('kW56154F4EE22346B0B1E806673A7434A9', 'padding-bottom'))
            .toBe('30px');
        await takeScreenshotByElement(
            viPanelStack.getPanelByID('kW56154F4EE22346B0B1E806673A7434A9'),
            'TC99644_05',
            'Format'
        );
    });

    it('[TC99644_06] Validate functionality of Selector Panel in authoring - update automatically', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Update Automatically' });
        // Not Update Automatically
        const notUpdateYear = InCanvasSelector.createByTitle('Year - Not Update Automatically');
        const notUpdateQuarter = InCanvasSelector.createByTitle('Quarter - Not Update Automatically');
        await notUpdateYear.selectItem('2014');
        await dossierAuthoringPage.sleep(2000);
        await since('Uncheck 2014, Not Updated Quarter selected should be #{expected}, while we get #{actual}')
            .expect(await notUpdateQuarter.getSelectedItemsText())
            .toEqual([]);

        // Update Automatically
        const updateYear = InCanvasSelector.createByTitle('Year - Update Automatically');
        await updateYear.selectItem('2014');
        const updateQuarter = InCanvasSelector.createByTitle('Quarter - Update Automatically');
        await dossierAuthoringPage.sleep(2000);
        await since('Uncheck 2014, Updated Quarter selected should be #{expected}, while we get #{actual}')
            .expect(await updateQuarter.isItemSelected('(All)'))
            .toBe(true);
    });

    it('[TC99644_07] Validate X-functionality of Selector Panel in authoring - Pause Mode', async () => {
        await libraryPage.editDossierByUrl({
            projectId: authoringDossier.project.id,
            dossierId: authoringDossier.id,
        });
        await contentsPanel.goToPage({ chapterName: 'Chapter 1', pageName: 'Format Panel' });
        await dossierAuthoringPage.actionOnToolbar('Pause Data Retrieval');
        const yearICS = InCanvasSelector.createByAriaLable('Year');
        await yearICS.clickEditButtonInPauseMode();
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await yearICS.selectItem('2015');
        await dossierAuthoringPage.actionOnToolbar('Resume Data Retrieval');
        await dossierAuthoringPage.waitForAuthoringPageLoading();
        await since('Uncheck 2015, selection should be #{expected}, while we get #{actual}')
            .expect(await yearICS.getSelectedItemsText())
            .toEqual(['2014', '2016']);
        await since('Uncheck 2015, grid data should be #{expected}, while we get #{actual}')
            .expect(await grid.getOneColumnData('Visualization 1', 'Year'))
            .toEqual(['2014', '2016']);
    });
});
